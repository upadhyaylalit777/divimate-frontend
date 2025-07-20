import React from 'react';
import {
  Box,
  Container,
  Flex,
  Text,
  VStack,
  Heading,
} from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box
      bg="black"
      color="white"
      mt="auto"
    >
      <Container maxW="6xl" py={10}>
        {/* About Section */}
        <VStack spacing={6} align="center" textAlign="center" mb={8}>
          <Heading
            as="h3"
            size="lg"
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
            fontWeight="bold"
          >
            DiviMate
          </Heading>
          <Text fontSize="md" color="gray.300" lineHeight={1.8} maxW="md">
            Your trusted expense splitting app for groups and individuals. 
            Make sharing expenses simple, transparent, and hassle-free.
          </Text>
        </VStack>

        {/* Bottom Section */}
        <Flex
          justify="center"
          align="center"
          pt={6}
          borderTop="1px solid"
          borderColor="gray.700"
        >
          <Text fontSize="sm" color="gray.400">
            © 2025 DiviMate.co. All rights reserved.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;