import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  Alert,
} from "@chakra-ui/react";

export default function Createuser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      setSuccessMessage("User Created Successfully!");
      setName("");
      setEmail("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <Box maxW="md" mx="auto" p={4}>
      <Card>
        <CardHeader>
          <Heading size="lg">Create User</Heading>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Box w="full">
                <Text mb={2} fontWeight="medium">Name *</Text>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  isRequired
                />
              </Box>

              <Box w="full">
                <Text mb={2} fontWeight="medium">Email *</Text>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  isRequired
                />
              </Box>

              <Button type="submit" colorScheme="blue" width="full">
                Create User
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
    </Box>
  );
}