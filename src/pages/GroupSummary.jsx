import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Select,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  HStack,
  Text,
  Alert,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { useAuth, API_URL } from "../contexts/AuthContext"; // UPDATED: Import useAuth and API_URL

export default function GroupSummary() {
  const { groupId } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [userToRemove, setUserToRemove] = useState("");
  const [settlingTransaction, setSettlingTransaction] = useState(null);
  const toast = useToast();

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isRemoveOpen, onOpen: onRemoveOpen, onClose: onRemoveClose } = useDisclosure();
  const { isOpen: isSettleOpen, onOpen: onSettleOpen, onClose: onSettleClose } = useDisclosure();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidById, setPaidById] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const getHeaders = () => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  const fetchSummary = () => {
    // UPDATED: Use the dynamic API_URL
    fetch(`${API_URL}/api/groups/${groupId}/summary`, {
      headers: getHeaders()
    })
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load group summary",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const fetchAllUsers = () => {
    // UPDATED: Use the dynamic API_URL
    fetch(`${API_URL}/api/users`, {
      headers: getHeaders()
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllUsers(data);
        } else {
          console.error("Error: Fetched users data is not an array.", data);
          setAllUsers([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setAllUsers([]);
      });
  };

  useEffect(() => {
    fetchSummary();
    fetchAllUsers();
  }, [groupId]);

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessMessage("");

    try {
      // UPDATED: Use the dynamic API_URL
      const res = await fetch(
        `${API_URL}/api/groups/${groupId}/expenses`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            description,
            amount: parseFloat(amount),
            paidById: parseInt(paidById),
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      setSuccessMessage("Expense added successfully!");
      setDescription("");
      setAmount("");
      setPaidById("");
      fetchSummary();
      
      toast({
        title: "Success",
        description: "Expense added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setMessage(err.message);
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;
    
    setMessage("");
    setSuccessMessage("");

    try {
      // UPDATED: Use the dynamic API_URL
      const res = await fetch(`${API_URL}/api/groups/${groupId}/members`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ userId: parseInt(selectedUser) }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      setSuccessMessage("Member added successfully!");
      setSelectedUser("");
      fetchSummary();
      onAddClose();
      
      toast({
        title: "Success",
        description: "Member added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleRemoveMember = async () => {
    if (!userToRemove) return;
    
    setMessage("");
    setSuccessMessage("");

    try {
      // UPDATED: Use the dynamic API_URL
      const res = await fetch(`${API_URL}/api/groups/${groupId}/members/${userToRemove}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      setSuccessMessage("Member removed successfully!");
      setUserToRemove("");
      fetchSummary();
      onRemoveClose();
      
      toast({
        title: "Success",
        description: "Member removed successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleSettleTransaction = async () => {
    if (!settlingTransaction) return;

    try {
      // UPDATED: Use the dynamic API_URL
      const res = await fetch(`${API_URL}/api/groups/${groupId}/settle`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          fromUserId: settlingTransaction.fromUserId,
          toUserId: settlingTransaction.toUserId,
          amount: settlingTransaction.amount,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      toast({
        title: "Settlement Recorded",
        description: `${settlingTransaction.from} → ${settlingTransaction.to}: ₹${settlingTransaction.amount}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setSettlingTransaction(null);
      fetchSummary();
      onSettleClose();
    } catch (err) {
      toast({
        title: "Settlement Failed",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openSettleModal = (transaction) => {
    setSettlingTransaction(transaction);
    onSettleOpen();
  };

  const handleAddClose = () => {
    setMessage("");
    setSuccessMessage("");
    setSelectedUser("");
    onAddClose();
  };

  const handleRemoveClose = () => {
    setMessage("");
    setSuccessMessage("");
    setUserToRemove("");
    onRemoveClose();
  };

  const handleSettleClose = () => {
    setSettlingTransaction(null);
    onSettleClose();
  };

  if (loading) return <Box p={4}>Loading summary...</Box>;
  if (!summary) return <Box p={4}>Error loading group summary.</Box>;

  const availableUsersToAdd = Array.isArray(allUsers) 
    ? allUsers.filter(user => !summary.members.some(member => member.id === user.id)) 
    : [];

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        {currentUser && isAuthenticated ? (
          <Card bg="green.50" borderColor="green.200" borderWidth={1}>
            <CardBody>
              <HStack>
                <Badge colorScheme="green">Logged In</Badge>
                <Text>Welcome, {currentUser.name}!</Text>
              </HStack>
            </CardBody>
          </Card>
        ) : (
          <Card bg="orange.50" borderColor="orange.200" borderWidth={1}>
            <CardBody>
              <HStack>
                <Badge colorScheme="orange">Guest Mode</Badge>
                <Text>Log in to settle your debts</Text>
              </HStack>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader>
            <Heading size="lg">{summary.group}</Heading>
          </CardHeader>
          <CardBody>
            <Text mb={2}>Total Expense: ₹{summary.totalExpense}</Text>
            <Text>Split Per Head: ₹{summary.splitPerHead}</Text>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <HStack justifyContent="space-between">
              <Heading size="md">Members</Heading>
              <HStack>
                <Button size="sm" colorScheme="green" onClick={onAddOpen}>
                  Add Member
                </Button>
                <Button size="sm" colorScheme="red" onClick={onRemoveOpen}>
                  Remove Member
                </Button>
              </HStack>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" spacing={2}>
              {summary.members.map((member) => (
                <Box key={member.id} p={2} bg="gray.50" borderRadius="md">
                  <HStack justifyContent="space-between">
                    <VStack align="start" spacing={0}>
                      <HStack>
                        <Text fontWeight="medium">{member.name}</Text>
                        {currentUser && currentUser.id === member.id && (
                          <Badge colorScheme="blue" size="sm">You</Badge>
                        )}
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        Paid: ₹{member.paid} | Owes: ₹{member.owes}
                      </Text>
                    </VStack>
                    <VStack align="end" spacing={0}>
                      <Text 
                        fontWeight="bold" 
                        color={member.balance >= 0 ? "green.600" : "red.600"}
                      >
                        {member.balance >= 0 ? "+" : ""}₹{member.balance}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {member.balance >= 0 ? "is owed" : "owes"}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {summary.transactions.length > 0 && (
          <Card>
            <CardHeader>
              <Heading size="md">Transactions to Settle</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={2}>
                {summary.transactions.map((tx, idx) => (
                  <Box key={idx} p={3} bg="gray.50" borderRadius="md">
                    <HStack justifyContent="space-between" alignItems="center">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">
                          {tx.from} → {tx.to}
                        </Text>
                        <Text fontSize="lg" color="red.600" fontWeight="bold">
                          ₹{tx.amount}
                        </Text>
                      </VStack>
                      <VStack align="end" spacing={2}>
                        {tx.canSettle ? (
                          <Button
                            size="sm"
                            colorScheme="green"
                            onClick={() => openSettleModal(tx)}
                          >
                            Settle Debt
                          </Button>
                        ) : (
                          <VStack align="end" spacing={0}>
                            <Text fontSize="xs" color="gray.500">
                              {currentUser ? "Not your debt" : "Login to settle"}
                            </Text>
                            <Button
                              size="sm"
                              variant="outline"
                              colorScheme="gray"
                              disabled
                            >
                              Can't Settle
                            </Button>
                          </VStack>
                        )}
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader>
            <Heading size="md">Add New Expense</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleExpenseSubmit}>
              <VStack spacing={4}>
                <Input
                  type="text"
                  placeholder="Description (e.g., Dinner at restaurant)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />

                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount (₹)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />

                <Select
                  placeholder="Select who paid"
                  value={paidById}
                  onChange={(e) => setPaidById(e.target.value)}
                  required
                >
                  {summary.members.map((member) => (
                    <option key={member.id} value={member.id.toString()}>
                      {member.name} {currentUser && currentUser.id === member.id && "(You)"}
                    </option>
                  ))}
                </Select>

                <Button type="submit" colorScheme="blue" width="full" size="lg">
                  Add Expense
                </Button>

                {successMessage && (
                  <Alert status="success" w="full">
                    {successMessage}
                  </Alert>
                )}

                {message && (
                  <Alert status="error" w="full">
                    {message}
                  </Alert>
                )}
              </VStack>
            </form>
          </CardBody>
        </Card>
      </VStack>

      {/* Add Member Modal */}
      <Modal isOpen={isAddOpen} onClose={handleAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Member to Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Select
                placeholder="Select user to add"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {availableUsersToAdd.map((user) => (
                  <option key={user.id} value={user.id.toString()}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </Select>

              {availableUsersToAdd.length === 0 && (
                <Text color="gray.500" fontSize="sm" textAlign="center">
                  All registered users are already members of this group
                </Text>
              )}

              {message && (
                <Alert status="error" w="full">
                  {message}
                </Alert>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleAddMember} 
              disabled={!selectedUser}
            >
              Add Member
            </Button>
            <Button variant="ghost" onClick={handleAddClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Remove Member Modal */}
      <Modal isOpen={isRemoveOpen} onClose={handleRemoveClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove Member from Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="warning">
                <Text fontSize="sm">
                  Members with expenses cannot be removed until all expenses are settled.
                </Text>
              </Alert>
              
              <Select
                placeholder="Select member to remove"
                value={userToRemove}
                onChange={(e) => setUserToRemove(e.target.value)}
              >
                {summary.members.map((member) => (
                  <option key={member.id} value={member.id.toString()}>
                    {member.name} {currentUser && currentUser.id === member.id && "(You)"}
                  </option>
                ))}
              </Select>

              {message && (
                <Alert status="error" w="full">
                  {message}
                </Alert>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="red" 
              mr={3} 
              onClick={handleRemoveMember} 
              disabled={!userToRemove}
            >
              Remove Member
            </Button>
            <Button variant="ghost" onClick={handleRemoveClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Settle Transaction Modal */}
      <Modal isOpen={isSettleOpen} onClose={handleSettleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Settlement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {settlingTransaction && (
              <VStack spacing={4}>
                <Alert status="info">
                  <VStack align="start" spacing={1} w="full">
                    <Text fontWeight="bold">You are about to record a settlement:</Text>
                    <Text fontSize="sm">
                      This will update the group balances to reflect that you have paid your debt.
                    </Text>
                  </VStack>
                </Alert>
                
                <Box p={4} bg="gray.50" borderRadius="md" w="full" textAlign="center">
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    {settlingTransaction.from} pays {settlingTransaction.to}
                  </Text>
                  <Text fontSize="2xl" color="green.600" fontWeight="bold">
                    ₹{settlingTransaction.amount}
                  </Text>
                </Box>
                
                <Alert status="warning">
                  <Text fontSize="sm">
                    Make sure you have actually made this payment before confirming!
                  </Text>
                </Alert>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="green" 
              mr={3} 
              onClick={handleSettleTransaction}
              size="lg"
            >
              ✓ Confirm I Paid This
            </Button>
            <Button variant="ghost" onClick={handleSettleClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}