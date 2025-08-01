import React, { useState } from 'react';
import DomainInfoTable from './DomainInfoTable';
import ContactInfoTable from './ContactInfoTable';

function WhoisForm() {
  const [domain, setDomain] = useState('');
  const [domainData, setDomainData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [selectedTable, setSelectedTable] = useState('tblDomainInfo');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWhoisData = async (dataType) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/whois`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, dataType }),
    });
    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error || 'Lookup failed');
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDomainData(null);
    setContactData(null);
    setLoading(true);

    try {
      const [domainInfo, contactInfo] = await Promise.all([
        fetchWhoisData('domain'),
        fetchWhoisData('contact'),
      ]);

      setDomainData(domainInfo);
      setContactData(contactInfo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
  };

  return (
<div className="flex justify-center min-h-screen py-10 px-4 bg-[#282c34]">
  <div className="w-full max-w-6xl bg-white/10 backdrop-blur-md rounded-xl p-6 text-white shadow-xl">
        
        <div className="space-y-4 min-h-[200px]">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/whois-lookup-icon.png"
              alt="WHOIS Logo"
              className="w-20 h-20"
            />
            <h1 className="text-3xl font-bold text-white tracking-wide font-[Inter]">
              WHOIS Lookup
            </h1>
          </div>

          <label htmlFor="domain" className="flex text-white mb-1">Domain Name:</label>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain (e.g. example.com)"
              required
              className="border rounded px-4 py-2 w-full sm:flex-1 text-black"
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white px-4 py-2 rounded transition w-full sm:w-auto 
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </form>

          <label htmlFor="tableSelect" className="flex text-white">Select Information:</label>
          <select
            id="tableSelect"
            value={selectedTable}
            onChange={handleTableChange}
            className="border rounded px-4 py-2 w-full text-black"
          >
            <option value="tblDomainInfo">Domain Information</option>
            <option value="tblContactInfo">Contact Information</option>
          </select>

          {error && <p className="text-red-600">{error}</p>}
        </div>
        
        <div className="overflow-x-auto max-w-full">
          {selectedTable === 'tblDomainInfo' && domainData && (
            <DomainInfoTable data={domainData} />
          )}
          {selectedTable === 'tblContactInfo' && contactData && (
            <ContactInfoTable data={contactData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default WhoisForm;