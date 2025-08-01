import React from 'react';

function DomainInfoTable({ data }) {
  if (!data) return null;

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full table-fixed text-sm bg-white text-black">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Domain Name</th>
            <th className="border px-4 py-2">Registrar</th>
            <th className="border px-4 py-2">Registration Date</th>
            <th className="border px-4 py-2">Expiration Date</th>
            <th className="border px-4 py-2">Estimated Domain Age</th>
            <th className="border px-4 py-2">Hostnames</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">{data.domainName || 'N/A'}</td>
            <td className="border px-4 py-2">{data.registrarName || 'N/A'}</td>
            <td className="border px-4 py-2">{data.registrationDate || 'N/A'}</td>
            <td className="border px-4 py-2">{data.expirationDate || 'N/A'}</td>
            <td className="border px-4 py-2">{data.domainAge || 'N/A'}</td>
            <td className="border px-4 py-2">{data.hostnames || 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default DomainInfoTable;