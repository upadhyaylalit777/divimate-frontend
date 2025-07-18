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
  Checkbox,
} from "@chakra-ui/react";

export default function GroupSummary() {
  const { groupId } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [userToRemove, setUserToRemove] = useState("");

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isRemoveOpen, onOpen: onRemoveOpen, onClose: onRemoveClose } = useDisclosure();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidById, setPaidById] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchSummary = () => {
    fetch(`http://localhost:4000/api/groups/${groupId}/summary`)
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchAllUsers = () => {
    fetch("http://localhost:4000/api/users")
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
      const res = await fetch(
        `http://localhost:4000/api/groups/${groupId}/expenses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;
    
    setMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(`http://localhost:4000/api/groups/${groupId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleRemoveMember = async () => {
    if (!userToRemove) return;
    
    setMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(`http://localhost:4000/api/groups/${groupId}/members/${userToRemove}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      setSuccessMessage("Member removed successfully!");
      setUserToRemove("");
      fetchSummary();
      onRemoveClose();
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Clear messages when modals close
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

  if (loading) return <Box p={4}>Loading summary...</Box>;
  if (!summary) return <Box p={4}>Error loading group summary.</Box>;

  const availableUsersToAdd = Array.isArray(allUsers) 
    ? allUsers.filter(user => !summary.members.some(member => member.id === user.id)) 
    : [];

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
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
                  <Text>
                    {member.name} — Paid: ₹{member.paid}, Owes: ₹{member.owes}, Balance: ₹{member.balance}
                  </Text>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {summary.transactions.length > 0 && (
          <Card>
            <CardHeader>
              <Heading size="md">Transactions</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={2}>
                {summary.transactions.map((tx, idx) => (
                  <Box key={idx} p={2} bg="gray.50" borderRadius="md">
                    <Text>
                      {tx.from} → {tx.to}: ₹{tx.amount}
                    </Text>
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
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />

                <Input
                  type="number"
                  placeholder="Amount"
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
                      {member.name}
                    </option>
                  ))}
                </Select>

                <Button type="submit" colorScheme="blue" width="full">
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
          <ModalHeader>Add Member</ModalHeader>
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

              {message && (
                <Alert status="error" w="full">
                  {message}
                </Alert>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddMember} disabled={!selectedUser}>
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
          <ModalHeader>Remove Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Select
                placeholder="Select member to remove"
                value={userToRemove}
                onChange={(e) => setUserToRemove(e.target.value)}
              >
                {summary.members.map((member) => (
                  <option key={member.id} value={member.id.toString()}>
                    {member.name}
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
            <Button colorScheme="red" mr={3} onClick={handleRemoveMember} disabled={!userToRemove}>
              Remove Member
            </Button>
            <Button variant="ghost" onClick={handleRemoveClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}