// This is a partial update that should be merged into the existing CulvertSizingForm.js
// Add this to the formValues state initialization:

  const [formValues, setFormValues] = useState({
    culvertId: '',
    roadName: '',
    slopePercent: '',
    streamRoughness: '0.04',
    pipeRoughness: '0.024',
    maxHwdRatio: '0.8', // Default to conservative 0.8 HW/D ratio
    climateChangeFactor: '1.2', // Default climate change factor (20% increase)
    fishPassage: false,
    latitude: '',
    longitude: ''
  });

// Add this to the Settings stage form:

        <div className="form-group">
          <label className="form-label">Climate Change Factor</label>
          <select
            name="climateChangeFactor"
            className="form-input"
            value={formValues.climateChangeFactor}
            onChange={handleInputChange}
          >
            <option value="1.0">None (1.0×)</option>
            <option value="1.1">Minimal (1.1×)</option>
            <option value="1.2">Moderate (1.2×)</option>
            <option value="1.3">Significant (1.3×)</option>
            <option value="1.5">Severe (1.5×)</option>
          </select>
          <div className="helper-text">
            Multiplier applied to flow calculations to account for future climate change impacts
          </div>
        </div>

// Update the calculateSize function to pass the climate change factor:

  const calculateSize = () => {
    if (!validateStage()) return;
    
    const { avgTopWidth, avgBottomWidth, avgDepth } = calculateAverages();
    
    const params = {
      topWidth: avgTopWidth,
      bottomWidth: useBottomWidth ? avgBottomWidth : undefined,
      avgStreamDepth: avgDepth,
      slopePercent: parseFloat(formValues.slopePercent),
      streamRoughness: parseFloat(formValues.streamRoughness),
      pipeRoughness: parseFloat(formValues.pipeRoughness),
      maxHwdRatio: parseFloat(formValues.maxHwdRatio),
      climateChangeFactor: parseFloat(formValues.climateChangeFactor),
      fishPassage: formValues.fishPassage
    };
    
    // Small delay to allow loading state to be visible
    setTimeout(() => {
      const calculationResults = calculateCulvert(params);
      setResults(calculationResults);
      setStage(STAGES.RESULTS);
      setIsLoading(false);
    }, 500);
  };
