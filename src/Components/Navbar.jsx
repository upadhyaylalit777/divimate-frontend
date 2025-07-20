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
  Spacer,
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
      px={4}
      py={2}
      rounded="full"
      fontWeight={isActive ? "600" : "500"}
      fontSize="sm"
      color={isActive ? "white" : "gray.700"}
      bg={isActive ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent"}
      _hover={{
        textDecoration: 'none',
        bg: isActive ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "gray.50",
        color: isActive ? "white" : "gray.900",
        transform: "translateY(-1px)",
      }}
      transition="all 0.3s ease"
      position="relative"
      {...props}
    >
      {children}
    </Link>
  );
};

const Navbar = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const loggedInLinks = [
    { name: 'Dashboard', path: '/' },
    // { name: 'Create Group', path: '/create-group' },
  ];

  const loggedOutLinks = [
    { name: 'Home', path: '/' },
    { name: 'Login', path: '/login' },
  ];

  const authLinks = isAuthenticated ? loggedInLinks : loggedOutLinks;

  return (
    <>
      <Box 
        bg="rgba(255, 255, 255, 0.95)" 
        backdropFilter="blur(10px)"
        borderBottom="1px" 
        borderColor="rgba(255, 255, 255, 0.2)"
        position="sticky" 
        top={0} 
        zIndex={1000}
        boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
      >
        <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
          <Flex h={{ base: 16, md: 20 }} alignItems="center" justifyContent="space-between">
            {/* Logo */}
            <Box>
              <Text 
                fontSize={{ base: "xl", md: "2xl" }} 
                fontWeight="800" 
                bgGradient="linear(to-r, #667eea, #764ba2)"
                bgClip="text"
                letterSpacing="-0.5px"
              >
                DiviMate
              </Text>
            </Box>

            {/* Desktop Navigation */}
            <HStack spacing={{ base: 4, md: 8 }} alignItems="center" display={{ base: 'none', md: 'flex' }}>
              <HStack as="nav" spacing={1} bg="gray.50" p={1} rounded="full">
                {authLinks.map((link) => (
                  <NavLink key={link.path} to={link.path}>
                    {link.name}
                  </NavLink>
                ))}
              </HStack>
              
              {isAuthenticated && (
                <HStack spacing={4} alignItems="center">
                  <Text fontSize="sm" color="gray.600" fontWeight="500">
                    Hey, {user?.name}! 👋
                  </Text>
                  <Button 
                    size="sm" 
                    bg="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
                    color="white"
                    rounded="full"
                    px={6}
                    fontWeight="600"
                    _hover={{
                      bg: "linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(238, 90, 36, 0.3)"
                    }}
                    transition="all 0.3s ease"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </HStack>
              )}
            </HStack>

            {/* Mobile Menu Button */}
            <Box display={{ md: 'none' }}>
              <IconButton
                size="sm"
                icon={<HamburgerIcon />}
                aria-label="Open Menu"
                onClick={onOpen}
                variant="ghost"
                rounded="full"
                minW="auto"
                w="40px"
                h="40px"
                _hover={{
                  bg: "gray.100",
                  transform: "scale(1.1)"
                }}
                transition="all 0.2s ease"
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay bg="rgba(0, 0, 0, 0.6)" />
        <DrawerContent 
          bg="white" 
          borderTopLeftRadius="2xl" 
          borderBottomLeftRadius="2xl"
          boxShadow="xl"
        >
          <DrawerCloseButton 
            top={6} 
            right={6} 
            rounded="full"
            _hover={{
              bg: "gray.100"
            }}
          />
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.100">
            <Text 
              fontSize="lg" 
              fontWeight="700" 
              bgGradient="linear(to-r, #667eea, #764ba2)"
              bgClip="text"
            >
              Navigation
            </Text>
          </DrawerHeader>
          <DrawerBody py={6}>
            <VStack spacing={4} align="stretch">
              {authLinks.map((link) => (
                <Box key={link.path}>
                  <NavLink 
                    to={link.path} 
                    onClick={onClose}
                    w="full"
                    display="block"
                    textAlign="center"
                    py={3}
                    rounded="xl"
                    _hover={{
                      bg: "gray.50",
                      transform: "translateX(4px)"
                    }}
                  >
                    {link.name}
                  </NavLink>
                </Box>
              ))}
              
              {isAuthenticated && (
                <VStack 
                  spacing={4} 
                  align="stretch" 
                  pt={6} 
                  borderTop="1px" 
                  borderColor="gray.100"
                  mt={4}
                >
                  <Text 
                    fontSize="sm" 
                    color="gray.600" 
                    textAlign="center"
                    fontWeight="500"
                  >
                    Hey, {user?.name}! 👋
                  </Text>
                  <Button 
                    bg="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
                    color="white"
                    rounded="xl"
                    py={3}
                    fontWeight="600"
                    _hover={{
                      bg: "linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(238, 90, 36, 0.3)"
                    }}
                    transition="all 0.3s ease"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </VStack>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      
      <Box>{children}</Box>
    </>
  );
};

export default Navbar;