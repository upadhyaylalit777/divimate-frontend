import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useDisclosure,
  Stack,
  Container,
  Text,
  useColorModeValue,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavLink = ({ children, to, ...props }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      as={RouterLink}
      to={to}
      px={3}
      py={2}
      rounded="md"
      fontWeight={isActive ? "bold" : "medium"}
      color={isActive ? "blue.500" : "gray.600"}
      bg={isActive ? "blue.50" : "transparent"}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('blue.50', 'blue.900'),
        color: useColorModeValue('blue.500', 'blue.200'),
      }}
      transition="all 0.2s"
      {...props}
    >
      {children}
    </Link>
  );
};

const Navbar = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Authentication hooks
  const { user, logout, isAuthenticated } = useAuth();
  const toast = useToast();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Create User', path: '/create-user' },
    { name: 'Create Group', path: '/create-group' },
    { name: 'Login', path: '/login' },
  ];

  return (
    <>
      <Box bg={bg} borderBottom="1px" borderColor={borderColor} position="sticky" top={0} zIndex={10}>
        <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
          <Flex h={{ base: 14, md: 16 }} alignItems="center" justifyContent="space-between">
            {/* Logo/Brand */}
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="red.600">
              DiviMate
            </Text>

            {/* Desktop Navigation */}
            <HStack spacing={{ base: 4, md: 8 }} alignItems="center" display={{ base: 'none', md: 'flex' }}>
              <HStack as="nav" spacing={{ base: 2, md: 4 }}>
                {navLinks.map((link) => (
                  <NavLink key={link.path} to={link.path}>
                    {link.name}
                  </NavLink>
                ))}
              </HStack>
              
              {/* User Authentication Section */}
              {isAuthenticated && (
                <HStack spacing={3} alignItems="center">
                  <Text fontSize="sm" color="gray.600">
                    Welcome, {user?.name}
                  </Text>
                  <Button size="sm" colorScheme="red" onClick={handleLogout}>
                    Logout
                  </Button>
                </HStack>
              )}
            </HStack>

            {/* Mobile menu button */}
            <IconButton
              size={{ base: "sm", md: "md" }}
              icon={<HamburgerIcon />}
              aria-label="Open Menu"
              display={{ md: 'none' }}
              onClick={onOpen}
            />
          </Flex>
        </Container>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Navigation</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path} onClick={onClose}>
                  {link.name}
                </NavLink>
              ))}
              
              {/* Mobile User Authentication Section */}
              {isAuthenticated && (
                <VStack spacing={2} align="stretch" pt={4} borderTop="1px" borderColor="gray.200">
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Welcome, {user?.name}
                  </Text>
                  <Button size="sm" colorScheme="red" onClick={handleLogout}>
                    Logout
                  </Button>
                </VStack>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box>{children}</Box>
    </>
  );
};

export default Navbar;