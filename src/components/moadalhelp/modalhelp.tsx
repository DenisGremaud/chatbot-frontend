import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import './modalhelp.css';

interface AideModalProps {
  open: boolean;
  handleClose: () => void;
}

const AideModal: React.FC<AideModalProps> = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="aide-modal-box">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Aide & Informations
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
		  Bienvenue sur le chatbot de l'UNIL <br />
		  Ce chatbot est là pour vous aider à trouver des informations administratives sur l'UNIL. <br />
        </Typography>
        <Button variant="contained" className='aide-modal-button' onClick={handleClose} sx={{ mt: 2 }}>Fermer</Button>
      </Box>
    </Modal>
  );
};

export default AideModal;
