import React from 'react';
import { Container, Box, Text, Spinner } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';

const Protectedroute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Container maxW="md" py={8}>
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" />
          <Text mt={4}>Loading...</Text>
        </Box>
      </Container>
    );
  }
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return children;
};

export default Protectedroute;