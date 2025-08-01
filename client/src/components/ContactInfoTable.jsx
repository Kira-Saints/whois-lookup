import React from 'react';

function ContactInfoTable({ data }) {
  if (!data) return null;

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full table-fixed text-sm bg-white text-black">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Registrant Name</th>
            <th className="border px-4 py-2">Technical Contact</th>
            <th className="border px-4 py-2">Administrative Contact</th>
            <th className="border px-4 py-2">Contact Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">{data.registrantName || 'N/A'}</td>
            <td className="border px-4 py-2">{data.technicalContactName || 'N/A'}</td>
            <td className="border px-4 py-2">{data.administrativeContactName || 'N/A'}</td>
            <td className="border px-4 py-2">{data.contactEmail || 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ContactInfoTable;