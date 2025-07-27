import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Alert, 
  AlertIcon, 
  Heading, 
  Text, 
  Link, 
  useToast,
  Container,
  Card,
  CardBody,
  InputGroup,
  InputRightElement,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Code
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register, debugInfo } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  
  // Show debug info in development or if there are issues
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    const hasErrors = Object.keys(errors).length > 0;
    setShowDebug(isDev || hasErrors);
  }, [errors]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      let result;
      
      // Add device info for debugging
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        language: navigator.language,
        storageAvailable: (() => {
          try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
          } catch (e) {
            return false;
          }
        })()
      };
      
      console.log('Device Info:', deviceInfo);
      
      if (isLogin) {
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        console.log("Registering with:", {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
      
      console.log('Auth result:', result);
      
      if (result.success) {
        toast({
          title: isLogin ? 'Login successful' : 'Registration successful',
          description: `Welcome ${result.user.name}!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          navigate('/');
        }, 100);
        
        // Reset form
        setFormData({
          email: '',
          password: '',
          name: '',
          confirmPassword: ''
        });
      } else {
        toast({
          title: 'Authentication Error',
          description: result.error || 'An authentication error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        
        // Log detailed error info
        console.error('Authentication failed:', {
          error: result.error,
          deviceInfo,
          debugInfo
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast({
        title: 'Network Error',
        description: error.message || 'Please check your internet connection and try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container maxW="md" py={8}>
      <Card>
        <CardBody>
          <VStack spacing={6}>
            <Heading size="lg" color="blue.600">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Heading>
            
            <Text color="gray.600" textAlign="center">
              {isLogin 
                ? 'Sign in to your account to continue' 
                : 'Sign up to get started with your account'
              }
            </Text>
            
            {/* Demo credentials notice */}
            {isLogin && (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text fontSize="sm">
                    Demo credentials: virat@gmail.com / virat1234
                  </Text>
                </Box>
              </Alert>
            )}
            

            
            <Box as="form" onSubmit={handleSubmit} width="100%">
              <VStack spacing={4}>
                {!isLogin && (
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      bg="gray.50"
                      border="1px"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.400' }}
                      _focus={{ borderColor: 'blue.500', bg: 'white' }}
                    />
                    {errors.name && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.name}
                      </Text>
                    )}
                  </FormControl>
                )}
                
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{ borderColor: 'blue.500', bg: 'white' }}
                  />
                  {errors.email && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.email}
                    </Text>
                  )}
                </FormControl>
                
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      bg="gray.50"
                      border="1px"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.400' }}
                      _focus={{ borderColor: 'blue.500', bg: 'white' }}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.password}
                    </Text>
                  )}
                </FormControl>
                
                {!isLogin && (
                  <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      bg="gray.50"
                      border="1px"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.400' }}
                      _focus={{ borderColor: 'blue.500', bg: 'white' }}
                    />
                    {errors.confirmPassword && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </FormControl>
                )}
                
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  isLoading={isLoading}
                  loadingText={isLogin ? 'Signing in...' : 'Creating account...'}
                  mt={4}
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </VStack>
            </Box>
            
            <Box textAlign="center">
              <Text color="gray.600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Link
                  color="blue.500"
                  fontWeight="medium"
                  onClick={() => setIsLogin(!isLogin)}
                  cursor="pointer"
                  _hover={{ color: 'blue.600' }}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </Link>
              </Text>
            </Box>
            

          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Login;