import React, { useState, useEffect } from 'react';

const LinkSharingModal = ({ selectedProject, isOpen, onClose }) => {
  const [selectedPermission, setSelectedPermission] = useState('None');

  useEffect(() => {
    // Mapping of permission codes to human-readable strings
    const permissionMapping = {
      0: 'None',
      1: 'View',
      2: 'Edit'
    };
  
    // Only proceed if there's a selectedProject
    if (selectedProject) {
      selectedProject.getLinkSharingPermission().then((p) => {
        setSelectedPermission(permissionMapping[p] || 'None');
      });
    }
  
  }, [selectedProject]);  // The effect depends on the selectedProject

  function selectPermission(permission) {
    setSelectedPermission(permission);
    selectedProject.updateLinkSharingPermission(permission);
  }

  const handleGenerateLink = async () => {
    const url = selectedProject.generateSharableURL();
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied.");
    } catch (err) {
      alert("Failed to copy link.");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Share "{selectedProject.name}"</h2>
        <h4>Link Access</h4>
        <select 
          value={selectedPermission} 
          onChange={(e) => selectPermission(e.target.value)}>
          <option value="None">None</option>
          <option value="View">View</option>
          <option value="Edit">Edit</option>
        </select>
        <div className="modal-button-container">
          <button className="link-button" onClick={handleGenerateLink}>Copy Link</button>
          <button className="done-button" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

export default LinkSharingModal;