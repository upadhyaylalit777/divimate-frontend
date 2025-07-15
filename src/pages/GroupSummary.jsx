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
  Text,
  Alert,
} from "@chakra-ui/react";

export default function GroupSummary() {
  const { groupId } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidById, setPaidById] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Create a separate function that can be called from anywhere
  const fetchSummary = () => {
    fetch(`http://localhost:4000/groups/${groupId}/summary`)
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

  useEffect(() => {
    fetchSummary();
  }, [groupId]); // This will still trigger the warning, but it's functional

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(
        `http://localhost:4000/groups/${groupId}/expenses`,
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
      fetchSummary(); // Now this works!
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <Box p={4}>Loading summary...</Box>;
  if (!summary) return <Box p={4}>Error loading group summary.</Box>;

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
            <Heading size="md">Members</Heading>
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
    </Box>
  );
}