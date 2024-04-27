import React from 'react';

const AddToOrderModal = ({ show, onClose, onConfirm, productName }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal" style={{ display: 'block' }}> {/* Inline style for simplicity */}
      <div className="modal-content">
        <h4>Add this Product to Order?</h4>
        <p>Are you sure you want to add <strong>{productName}</strong> to the order?</p>
        <div>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default AddToOrderModal;
