// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import socket from '@/services/socket';
// import { receiveMessage } from '@/store/slices/messageSlice'; // Adjust the path as necessary

// const SocketListener: React.FC = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     socket.on('newMessage', (message) => {
//       dispatch(receiveMessage(message));
//     });

//     return () => {
//       socket.off('newMessage');
//     };
//   }, [dispatch]);

//   return null;
// };

// export default SocketListener;
