import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'; // Itt csatoljuk be a CSS-t

const API_URL = ''; 

function App() {
  const [inventors, setInventors] = useState([]);
  const [formData, setFormData] = useState({ name: '', born: '', died: '' });

  // Adatok betöltése a szerverről
  const fetchInventors = async () => {
    try {
      const response = await axios.get(API_URL);
      setInventors(response.data);
    } catch (err) {
      console.error("Hiba az adatok lekérésekor", err);
    }
  };

  useEffect(() => { fetchInventors(); }, []);

  // Új adat beküldése
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, formData);
    setFormData({ name: '', born: '', died: '' });
    fetchInventors();
  };

  // Törlés
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchInventors();
  };

  return (
    <div className="App">
      <header>
        <h1>Web programozás-1 Előadás Házi feladat</h1>
      </header>
      
      <main style={{ padding: '20px' }}>
        <h3>Feltaláló Felvétele</h3>
        <form onSubmit={handleSubmit}>
          <label>Teljes neve</label><br/>
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /><br/>
          
          <label>Születési Évszáma</label><br/>
          <input type="number" value={formData.born} onChange={e => setFormData({...formData, born: e.target.value})} /><br/>
          
          <label>Halálozás Évszáma</label><br/>
          <input type="number" value={formData.died} onChange={e => setFormData({...formData, died: e.target.value})} /><br/><br/>
          
          <button type="submit">Beküld</button>
          <button type="reset" onClick={() => setFormData({name:'', born:'', died:''})}>Visszavon</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Név</th>
              <th>Születési Dátum</th>
              <th>Halálozás dátuma</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {inventors.map(i => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{i.born}</td>
                <td>{i.died}</td>
                <td><button onClick={() => handleDelete(i.id)}>Törlés</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer>
        <b>Debreczeni Ákos - HWF5W0 , Pálmai Ádám - YB5SIV</b>
      </footer>
    </div>
  );
}

export default App;