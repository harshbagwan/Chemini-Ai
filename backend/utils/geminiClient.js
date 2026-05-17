// // // import fetch from "node-fetch";

// // // export const callGemini = async (messages) => {
// // //   const limited = messages.slice(-10);

// // //   const res = await fetch(
// // //     `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
// // //     {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({
// // //         contents: limited.map((m) => ({
// // //           role: "user", // 🔥 force user role
// // //           parts: [{ text: m.content }],
// // //         })),
// // //       }),
// // //     }
// // //   );

// // //   const data = await res.json();

// // //   console.log("Gemini Raw:", data);

// // //   if (data.error) {
// // //     console.error("Gemini Error:", data.error);
// // //     return "Gemini API error";
// // //   }

// // //   return (
// // //     data.candidates?.[0]?.content?.parts?.[0]?.text ||
// // //     "No valid response from AI"
// // //   );
// // // };



// // import fetch from "node-fetch";

// // export const callGemini = async (messages) => {
// //   try {
// //     const res = await fetch(
// //       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
// //       {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           contents: [
// //             {
// //               role: "user",
// //               parts: [
// //                 {
// //                   text: messages.map((m) => m.content).join("\n"),
// //                 },
// //               ],
// //             },
// //           ],
// //         }),
// //       }
// //     );

// //     const data = await res.json();

// //     console.log("🔴 FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

// //     if (data.error) {
// //       return `Gemini Error: ${data.error.message}`;
// //     }

// //     return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
// //   } catch (err) {
// //     console.error("Fetch Error:", err);
// //     return "Server error while calling Gemini";
// //   }
// // };



// import fetch from "node-fetch";

// export const callGemini = async (messages) => {
//   try {
//     const res = await fetch(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               role: "user",
//               parts: [
//                 {
//                   text: messages.map((m) => m.content).join("\n"),
//                 },
//               ],
//             },
//           ],
//         }),
//       }
//     );

//     const data = await res.json();

//     console.log("Gemini response:", data);

//     if (data.error) {
//       return data.error.message;
//     }

//     return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
//   } catch (err) {
//     console.error(err);
//     return "Error calling Gemini";
//   }
// };

import fetch from "node-fetch";

export const callGemini = async (messages) => {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: messages.map((m) => m.content).join("\n"),
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    console.log("Gemini Response:", data);

    if (data.error) {
      return data.error.message;
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  } catch (err) {
    console.error(err);
    return "Error calling Gemini";
  }
};