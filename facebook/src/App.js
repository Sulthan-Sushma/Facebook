import React, { useState, useEffect } from 'react';
import OAuth2Login from 'react-simple-oauth2-login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [pageStats, setPageStats] = useState(null);

  const onSuccess = async (response) => {
    const accessToken = response.access_token;
    try {
      const profileResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,picture&access_token=${accessToken}`);
      const profile = await profileResponse.json();
      setUser(profile);

      const pagesResponse = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
      const pagesData = await pagesResponse.json();
      setPages(pagesData.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const onFailure = (response) => {
    console.log(response);
  };

  const fetchPageStats = async (pageId, since, until, period) => {
    try {
      const response = await fetch(`/api/page-stats?pageId=${pageId}&since=${since}&until=${until}&period=${period}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPageStats(data);
    } catch (error) {
      console.error('Error fetching total over range:', error);
    }
  };

  useEffect(() => {
    if (selectedPage) {
      fetchPageStats(selectedPage, '2023-01-01', '2023-12-31', 'total_over_range');
    }
  }, [selectedPage]);

  return (
    <div className="App">
      {!user ? (
        <OAuth2Login
          buttonText='Login with Facebook'
          authorizationUrl="https://www.facebook.com/dialog/oauth"
          responseType="token"
          clientId="1556053341615128"
          redirectUri="http://localhost:3000"
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      ) : (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <img src={user.picture.data.url} alt={user.name} style={{ width: '100px', height: 'auto' }} />
          
          {pages.length > 0 && (
            <div>
              <select onChange={(e) => setSelectedPage(e.target.value)} value={selectedPage || ''}>
                <option value="" disabled>Select a page</option>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>{page.name}</option>
                ))}
              </select>
            </div>
          )}

          {pageStats && (
            <div className="stats-cards">
              <div className="card">
                <h3>Total Followers / Fans</h3>
                <p>{pageStats.total_followers}</p>
              </div>
              <div className="card">
                <h3>Total Engagement</h3>
                <p>{pageStats.total_engagement}</p>
              </div>
              <div className="card">
                <h3>Total Impressions</h3>
                <p>{pageStats.total_impressions}</p>
              </div>
              <div className="card">
                <h3>Total Reactions</h3>
                <p>{pageStats.total_reactions}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
