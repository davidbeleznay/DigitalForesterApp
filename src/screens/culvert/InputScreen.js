import React from 'react';
import { useNavigate } from 'react-router-dom';
import CulvertSizingForm from '../../pages/CulvertSizingForm';

const InputScreen = () => {
  const navigate = useNavigate();
  
  return <CulvertSizingForm />;
};

export default InputScreen;
