// export function getClientID() {
//   return new Promise<string>((resolve) => {
//     chrome.storage.sync.get(['clientID'], (result) => {
//       let clientID = result.clientID;
      
//       if (!clientID) {
//         // chrome.runtime.id를 기본값으로 사용
//         clientID = chrome.runtime.id;
//         chrome.storage.sync.set({ clientID: clientID });
//       }
      
//       resolve(clientID);
//     });
//   });
// }