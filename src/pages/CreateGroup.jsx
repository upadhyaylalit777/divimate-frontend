import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Checkbox,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  HStack,
  Text,
  Alert,
} from "@chakra-ui/react";

export default function CreateGroup() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("http://localhost:4000/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, userIds: selectedUsers }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      setSuccessMessage("Group created successfully!");
      setName("");
      setSelectedUsers([]);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <Box maxW="md" mx="auto" p={4}>
      <Card>
        <CardHeader>
          <Heading size="lg">Create Group</Heading>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Box>
                <Text mb={2} fontWeight="medium">Group Name *</Text>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter group name"
                  isRequired
                />
              </Box>

              <Box>
                <Text mb={2} fontWeight="medium">Select Members</Text>
                <Box 
                  maxH="40" 
                  overflowY="auto" 
                  border="1px" 
                  borderColor="gray.200" 
                  borderRadius="md" 
                  p={3}
                >
                  <VStack align="stretch" spacing={2}>
                    {users.map((user) => (
                      <HStack key={user.id} spacing={3}>
                        <Checkbox
                          id={`user-${user.id}`}
                          isChecked={selectedUsers.includes(user.id)}
                          onChange={() => handleCheckboxChange(user.id)}
                        />
                        <Text fontSize="sm" flex={1}>
                          {user.name} ({user.email})
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </Box>

              <Button type="submit" colorScheme="blue" width="full">
                Create Group
              </Button>

              {successMessage && (
                <Alert status="success">
                  {successMessage}
                </Alert>
              )}

              {message && (
                <Alert status="error">
                  {message}
                </Alert>
              )}
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Box>
  );
}