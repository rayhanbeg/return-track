import  { useState } from 'react';
import PropTypes from 'prop-types';


const RequestModal = ({ asset, onRequest, onClose }) => {
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onRequest(asset._id, notes, asset.name, asset.type);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Request Asset</h2>
        <p><strong>Asset Name:</strong> {asset.name}</p>
        <p><strong>Asset Type:</strong> {asset.type}</p>
        <p><strong>Availability:</strong> {asset.availability}</p>
        <div className="mt-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <input
            type="text"
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="mr-2 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Request
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

RequestModal.propTypes = {
  asset: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    availability: PropTypes.string.isRequired,
  }).isRequired,
  onRequest: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RequestModal;
