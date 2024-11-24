import React from 'react';
import { 
	Modal, 
	Box, 
	Typography, 
	Button 
} from '@mui/material';
import './modalcontact.css';

interface ContactModalProps {
  open: boolean;
  handleClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal-container">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Nous contacter
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Pour toute question générale, veuillez consulter le site de <a href="https://www.unil.ch/" target="_blank" rel="noopener noreferrer">L'UNIL</a>, <br />
		  vous pouvez également consulter la page de <a href="https://www.unil.ch/central/home/contact.html" target="_blank" rel="noopener noreferrer">Contact</a>, <br />
          ou encore appeler le numéro suivant : +41 21 692 11 11.
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Pour toute information concernant les statistiques vous pouvez toujours envoyer un email à l'adresse suivante : <a href="mailto:unisis@unil.ch">unisis@unil.ch</a>.
        </Typography>
        <Button variant="contained" className='contact-modal-button' onClick={handleClose} sx={{ mt: 2 }}>Fermer</Button>
      </Box>
    </Modal>
  );
};

export default ContactModal;
