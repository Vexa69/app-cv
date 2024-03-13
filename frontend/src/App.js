import React, { useState } from 'react';
import GalaxyView from './Galaxy';
import SolarSystem from './SolarSystem';

const App = () => {
	const [view, setView] = useState('galaxy');

	const handleTransition = () => {
		setView('solarSystem');
	};

	return <div>{view === 'galaxy' ? <GalaxyView onTransition={handleTransition} /> : <SolarSystem />}</div>;
};

export default App;
