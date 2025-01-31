"use client";

import React, { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
// import { createContact } from "../lib/actions";

// export function ContactFormII() {
//   // const [state, formAction] = useFormState(createContact, {
//   //   message: "pending",
//   // });
//   const { pending } = useFormStatus();

//   return (
//     <form className="space-y-3 flex-1" action={formAction}>
//       <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
//         <div className="w-full">
//           <div>
//             <label className="form-control w-full max-w-xs">
//               <div className="label">
//                 <span className="label-text">Email</span>
//               </div>
//               <input
//                 className="input input-bordered w-full max-w-xs"
//                 id="email"
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 required
//               />
//             </label>
//           </div>
//           <div>
//             <label className="form-control w-full max-w-xs">
//               <div className="label">
//                 <span className="label-text">Phone Number</span>
//               </div>
//               <input
//                 className="input input-bordered w-full max-w-xs"
//                 id="phoneNumber"
//                 type="tel"
//                 name="phoneNumber"
//                 placeholder="Phone Number"
//                 required
//               />
//             </label>
//           </div>
//           <div>
//             <label className="form-control w-full max-w-xs">
//               <div className="label">
//                 <span className="label-text">First Name</span>
//               </div>
//               <input
//                 className="input input-bordered w-full max-w-xs"
//                 id="firstName"
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 required
//               />
//             </label>
//           </div>
//           <div>
//             <label className="form-control w-full max-w-xs">
//               <div className="label">
//                 <span className="label-text">Last Name</span>
//               </div>
//               <input
//                 className="input input-bordered w-full max-w-xs"
//                 id="lastName"
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 required
//               />
//             </label>
//           </div>
//           <div className="mt-4">
//             <label className="form-control w-full max-w-xs">
//               <div className="label">
//                 <span className="label-text">Company Name (Optional)</span>
//               </div>
//               <input
//                 className="input input-bordered w-full max-w-xs"
//                 id="companyName"
//                 type="text"
//                 name="companyName"
//                 placeholder="Company Name"
//               />
//             </label>
//           </div>
//           <div className="mt-4">
//             <label className="form-control">
//               <div className="label">
//                 <span className="label-text">Message</span>
//               </div>
//               <textarea
//                 className="textarea textarea-bordered h-32 w-1/4"
//                 placeholder="What are you looking for?"
//                 id="contactMessage"
//                 name="contactMessage"
//               ></textarea>
//             </label>
//           </div>
//         </div>
//         <div className="mt-4 flex space-x-2">
//           <input type="checkbox" id="policyAgreed" name="policyAgreed" />
//           <label className="label">
//             <span className="label-text">
//               Accept our Terms of Service and Privacy Policy
//             </span>
//           </label>
//         </div>
//         <button
//           className="btn btn-primary mt-4 w-1/6"
//           type="submit"
//           aria-disabled={pending}
//         >
//           Submit
//         </button>
//         <div className="flex h-8 items-end space-x-1">
//           {/* Add form errors here */}
//         </div>
//       </div>
//     </form>
//   );
// }
