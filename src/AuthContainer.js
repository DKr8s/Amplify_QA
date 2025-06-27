// src/AuthContainer.js
import { Authenticator } from '@aws-amplify/ui-react';

export default function AuthContainer() {
  return (
    <div className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        <Authenticator socialProviders={['google']} />
      </div>
    </div>
  );
}
