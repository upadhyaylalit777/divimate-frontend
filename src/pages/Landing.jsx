import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Card,
  CardBody,
  Avatar,
  AvatarGroup,
  Badge,
  Divider,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField
} from '@chakra-ui/react';
import { useAuth, API_URL } from '../contexts/AuthContext'; // UPDATED: Import API_URL

const Landing = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  // All useState hooks
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalExpenses: 0,
    totalOwed: 0
  });
  const [groupForm, setGroupForm] = useState({ name: '', selectedUsers: [] });
  const [expenseForm, setExpenseForm] = useState({ 
    description: '', 
    amount: '', 
    groupId: '', 
    paidById: user?.id || '' 
  });

  // All useColorModeValue hooks
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  // All useDisclosure hooks
  const { isOpen: isGroupModalOpen, onOpen: onGroupModalOpen, onClose: onGroupModalClose } = useDisclosure();
  const { isOpen: isExpenseModalOpen, onOpen: onExpenseModalOpen, onClose: onExpenseModalClose } = useDisclosure();

  // All function definitions
  const fetchGroups = async () => {
    try {
      if (!user?.id) {
        console.log('No user ID for fetching groups');
        return [];
      }
      
      console.log('Fetching groups for user:', user.id);
      // UPDATED: Use the dynamic API_URL
      const response = await fetch(`${API_URL}/api/groups?userId=${user.id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch groups: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Groups API response:', data);
      
      setGroups(data);
      return data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch groups: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return [];
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      // UPDATED: Use the dynamic API_URL
      const response = await fetch(`${API_URL}/api/users`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Users API response:', data);
      
      setUsers(data);
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return [];
    }
  };

  const calculateStats = async (groupsData) => {
    if (!user?.id) {
      console.log('No user ID found for stats calculation');
      return;
    }
    
    let totalExpenses = 0;
    let totalOwed = 0;
    
    console.log('=== CALCULATING STATS ===');
    console.log('User ID:', user.id, 'User Name:', user.name);
    console.log('Groups to process:', groupsData.length);
    
    for (const group of groupsData) {
      try {
        console.log(`\n--- Processing Group: ${group.name} (ID: ${group.id}) ---`);
        
        // UPDATED: Use the dynamic API_URL
        const response = await fetch(`${API_URL}/api/groups/${group.id}/summary`);
        if (!response.ok) {
          console.error(`Failed to fetch summary for group ${group.id}:`, response.status);
          continue;
        }
        
        const summary = await response.json();
        console.log('Group summary:', summary);
        
        totalExpenses += summary.totalExpense || 0;
        console.log(`Total expense for ${group.name}: ₹${summary.totalExpense || 0}`);
        
        const userBalance = summary.members.find(m => parseInt(m.id) === parseInt(user.id));
        console.log(`User balance object for ${group.name}:`, userBalance);
        
        if (userBalance && userBalance.balance < 0) {
          const amountOwed = Math.abs(userBalance.balance);
          totalOwed += amountOwed;
          console.log(`✓ User owes ₹${amountOwed} in ${group.name}`);
        }
        
      } catch (error) {
        console.error(`❌ Error fetching summary for group ${group.id}:`, error);
      }
    }
    
    console.log('\n=== FINAL CALCULATION ===');
    console.log('Total Groups:', groupsData.length);
    console.log('Total Expenses:', totalExpenses);
    console.log('Total Owed by User:', totalOwed);
    
    setStats({
      totalGroups: groupsData.length,
      totalExpenses: totalExpenses,
      totalOwed: totalOwed
    });
  };

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}/summary`);
  };

  const handleCreateGroup = async () => {
    try {
      if (!user?.id) {
        toast({
          title: 'Error',
          description: 'User not found',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      const userIds = [user.id, ...groupForm.selectedUsers.map(u => parseInt(u))];
      
      // UPDATED: Use the dynamic API_URL
      const response = await fetch(`${API_URL}/api/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: groupForm.name,
          userIds: userIds
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create group');
      }
      
      toast({
        title: 'Success',
        description: 'Group created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setGroupForm({ name: '', selectedUsers: [] });
      onGroupModalClose();
      
      const groupsData = await fetchGroups();
      if (groupsData.length > 0) {
        await calculateStats(groupsData);
      }
      
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create group: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddExpense = async () => {
    try {
      // UPDATED: Use the dynamic API_URL
      const response = await fetch(`${API_URL}/api/groups/${expenseForm.groupId}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: expenseForm.description,
          amount: parseFloat(expenseForm.amount),
          paidById: parseInt(expenseForm.paidById)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add expense');
      }
      
      toast({
        title: 'Success',
        description: 'Expense added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setExpenseForm({ 
        description: '', 
        amount: '', 
        groupId: '', 
        paidById: user?.id || '' 
      });
      onExpenseModalClose();
      
      const groupsData = await fetchGroups();
      if (groupsData.length > 0) {
        await calculateStats(groupsData);
      }
      
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to add expense: ' + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to logout',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // useEffect hooks
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        console.log('No user ID found, skipping data load');
        setLoading(false);
        return;
      }
      
      console.log('Loading data for user:', user.id);
      setLoading(true);
      
      try {
        const [groupsData, usersData] = await Promise.all([
          fetchGroups(),
          fetchUsers()
        ]);
        
        if (groupsData && groupsData.length > 0) {
          console.log('Calculating stats for', groupsData.length, 'groups');
          await calculateStats(groupsData);
        } else {
          console.log('No groups found, setting default stats');
          setStats({
            totalGroups: 0,
            totalExpenses: 0,
            totalOwed: 0
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please refresh the page.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id, toast]);

  useEffect(() => {
    setExpenseForm(prev => ({
      ...prev,
      paidById: user?.id || ''
    }));
  }, [user?.id]);

  // Early return checks
  if (!user) {
    return (
      <Box bg={bgColor} minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Redirecting...</Text>
        </VStack>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading your data...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={8}>
        {/* Welcome Section */}
        <VStack spacing={6} mb={8}>
          <Flex justify="space-between" align="center" w="100%">
            <Heading size="lg" color="blue.600">
               Your Dashboard
            </Heading>
          </Flex>
          <Heading size="xl" textAlign="center">
            Welcome back, {user?.name}!
          </Heading>
          <Text fontSize="lg" color="gray.600" textAlign="center" maxW="md">
            Keep track of your shared expenses and settle up with friends easily
          </Text>
        </VStack>

        {/* Quick Actions */}
        <HStack spacing={4} mb={8} justify="center">
          <Button leftIcon={<Box>👥</Box>} colorScheme="blue" size="lg" onClick={onGroupModalOpen}>
            Create Group
          </Button>
          <Button leftIcon={<Box>➕</Box>} colorScheme="green" size="lg" onClick={onExpenseModalOpen}>
            Add Expense
          </Button>
        </HStack>

        {/* Dashboard Grid */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={8}>
          {/* Groups */}
          <GridItem>
            <Card bg={cardBg}>
              <CardBody>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">Your Groups</Heading>
                  <Button size="sm" variant="ghost" onClick={onGroupModalOpen}>
                    Create New
                  </Button>
                </Flex>
                {groups.length === 0 ? (
                  <Alert status="info">
                    <AlertIcon />
                    No groups yet. Create your first group to get started!
                  </Alert>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {groups.map((group) => (
                      <Box 
                        key={group.id} 
                        p={4} 
                        borderRadius="md" 
                        border="1px" 
                        borderColor="gray.200"
                        cursor="pointer"
                        _hover={{ 
                          bg: 'gray.50', 
                          borderColor: 'blue.300',
                          transform: 'translateY(-2px)',
                          shadow: 'md'
                        }}
                        transition="all 0.2s"
                        onClick={() => handleGroupClick(group.id)}
                      >
                        <Flex justify="space-between" align="center" mb={2}>
                          <Heading size="sm">{group.name}</Heading>
                          <Badge colorScheme="blue">
                            {group.members?.length || 0} members
                          </Badge>
                        </Flex>
                        <Flex justify="space-between" align="center">
                          <HStack>
                            <AvatarGroup size="sm" max={3}>
                              {group.members?.map((member) => (
                                <Avatar key={member.id} name={member.name} size="sm" />
                              )) || []}
                            </AvatarGroup>
                          </HStack>
                          <Text fontSize="sm" color="gray.500">
                            Click to view summary
                          </Text>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                )}
              </CardBody>
            </Card>
          </GridItem>

          {/* Quick Stats */}
          <GridItem>
            <Card bg={cardBg}>
              <CardBody>
                <Heading size="md" mb={4}>Quick Stats</Heading>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold">{stats.totalGroups}</Text>
                    <Text color="gray.600">Active Groups</Text>
                  </Box>
                  <Divider />
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold">₹{stats.totalExpenses.toFixed(2)}</Text>
                    <Text color="gray.600">Total Expenses</Text>
                  </Box>
                  <Divider />
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold" color="red.500">
                      ₹{stats.totalOwed.toFixed(2)}
                    </Text>
                    <Text color="gray.600">You Owe</Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Container>

      {/* Create Group Modal */}
      <Modal isOpen={isGroupModalOpen} onClose={onGroupModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Group Name</FormLabel>
                <Input
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                  placeholder="Enter group name"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Add Members</FormLabel>
                <Select
                  placeholder="Select users to add"
                  value=""
                  onChange={(e) => {
                    const userId = e.target.value;
                    if (userId && !groupForm.selectedUsers.includes(userId)) {
                      setGroupForm({
                        ...groupForm,
                        selectedUsers: [...groupForm.selectedUsers, userId]
                      });
                    }
                  }}
                >
                  {users.filter(u => u.id !== user?.id).map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </Select>
              </FormControl>
              
              {groupForm.selectedUsers.length > 0 && (
                <Box>
                  <Text fontWeight="medium" mb={2}>Selected Members:</Text>
                  <VStack spacing={2}>
                    {groupForm.selectedUsers.map((userId) => {
                      const selectedUser = users.find(u => u.id === parseInt(userId));
                      return (
                        <Flex key={userId} justify="space-between" align="center" w="100%">
                          <Text>{selectedUser?.name}</Text>
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => {
                              setGroupForm({
                                ...groupForm,
                                selectedUsers: groupForm.selectedUsers.filter(id => id !== userId)
                              });
                            }}
                          >
                            Remove
                          </Button>
                        </Flex>
                      );
                    })}
                  </VStack>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onGroupModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleCreateGroup}
              isDisabled={!groupForm.name.trim()}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Expense Modal */}
      <Modal isOpen={isExpenseModalOpen} onClose={onExpenseModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  placeholder="Enter expense description"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Amount</FormLabel>
                <NumberInput>
                  <NumberInputField
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    placeholder="Enter amount"
                  />
                </NumberInput>
              </FormControl>
              
              <FormControl>
                <FormLabel>Group</FormLabel>
                <Select
                  value={expenseForm.groupId}
                  onChange={(e) => setExpenseForm({ ...expenseForm, groupId: e.target.value })}
                  placeholder="Select group"
                >
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Paid By</FormLabel>
                <Select
                  value={expenseForm.paidById}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paidById: e.target.value })}
                >
                  {expenseForm.groupId && (
                    groups.find(g => g.id === parseInt(expenseForm.groupId))?.members.map((member) => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))
                  )}
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onExpenseModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="green" 
              onClick={handleAddExpense}
              isDisabled={!expenseForm.description || !expenseForm.amount || !expenseForm.groupId || !expenseForm.paidById}
            >
              Add Expense
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Landing;