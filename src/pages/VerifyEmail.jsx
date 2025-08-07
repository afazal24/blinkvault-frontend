import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const VerifyEmail = () => {
  const { token } = useParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your account, please wait...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await axios.get(`/auth/verify-email/${token}`);
        
        // Log the user in using the data from the verification response
        login(res.data.user, res.data.accessToken);

        setStatus('success');
        setMessage(res.data.message || 'Verification successful! Redirecting...');

        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);

      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
      }
    };

    verifyToken();
  }, [token, login, navigate]);

  const StatusIcon = () => {
    switch (status) {
      case 'verifying':
        return <Loader2 size={64} className="mx-auto text-blue-500 animate-spin mb-4" />;
      case 'success':
        return <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />;
      case 'error':
        return <XCircle size={64} className="mx-auto text-red-500 mb-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
        <Helmet>
            <title>Email Verification | BlinkVault</title>
        </Helmet>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md text-center"
        >
            <StatusIcon />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {status === 'verifying' && 'Verification in Progress'}
                {status === 'success' && 'Verification Successful!'}
                {status === 'error' && 'Verification Failed'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{message}</p>
            {status === 'error' && (
                <Link to="/login" className="mt-6 inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition">
                    Back to Login
                </Link>
            )}
        </motion.div>
    </div>
  );
};

export default VerifyEmail;
