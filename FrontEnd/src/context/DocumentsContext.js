// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { documentsAPI } from '../services/api';

// const DocumentsContext = createContext();

// export const useDocuments = () => {
//   const context = useContext(DocumentsContext);
//   if (!context) {
//     throw new Error('useDocuments must be used within a DocumentsProvider');
//   }
//   return context;
// };

// export const DocumentsProvider = ({ children }) => {
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchDocuments = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await documentsAPI.getAll();
//       setDocuments(response.data || response);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDocumentById = async (id) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await documentsAPI.getById(id);
//       return response.data || response;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createDocument = async (documentData) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await documentsAPI.create(documentData);
//       setDocuments(prev => [...prev, response.data || response]);
//       return response;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateDocument = async (id, documentData) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await documentsAPI.update(id, documentData);
//       setDocuments(prev => 
//         prev.map(document => 
//           document._id === id || document.id === id 
//             ? { ...document, ...(response.data || response) }
//             : document
//         )
//       );
//       return response;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteDocument = async (id) => {
//     try {
//       setLoading(true);
//       setError(null);
//       await documentsAPI.delete(id);
//       setDocuments(prev => prev.filter(document => document._id !== id && document.id !== id));
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearError = () => setError(null);

//   const value = {
//     documents,
//     loading,
//     error,
//     fetchDocuments,
//     getDocumentById,
//     createDocument,
//     updateDocument,
//     deleteDocument,
//     clearError,
//   };

//   return (
//     <DocumentsContext.Provider value={value}>
//       {children}
//     </DocumentsContext.Provider>
//   );
// };

// export default DocumentsContext;
