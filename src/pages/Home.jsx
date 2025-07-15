import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  Flex,
  Spacer,
} from "@chakra-ui/react";

export default function Home() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/groups")
      .then((res) => res.json())
      .then(setGroups)
      .catch(console.error);
  }, []);

  return (
    <Box p={6}>
      <Heading as="h1" size="xl" mb={6}>
        All Groups
      </Heading>

      {groups.length === 0 ? (
        <Text>No groups available.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {groups.map((group) => (
            <Card key={group.id} variant="outline">
              <CardHeader>
                <Flex align="center">
                  <Heading as="h3" size="md">
                    {group.name}
                  </Heading>
                  <Spacer />
                  <Link to={`/group/${group.id}/summary`}>
                    <Button colorScheme="blue">View Summary</Button>
                  </Link>
                </Flex>
              </CardHeader>
              <CardBody pt={0}>
                <Text fontSize="sm" color="gray.600">
                  {group.members.length} Members
                </Text>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </Box>
  );
}