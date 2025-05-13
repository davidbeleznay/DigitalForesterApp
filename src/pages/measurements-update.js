// This is a partial update focusing on the stream measurements section
// to be added to the existing CulvertSizingForm.js file

  // Render more detailed Measurements stage with high water diagram
  const renderMeasurementsStage = () => {
    const { avgTopWidth, avgBottomWidth, avgDepth } = calculateAverages();
    
    return (
      <div className="card">
        <div className="site-information-header">
          <h2>Stream Measurements</h2>
        </div>
        
        <div className="high-water-diagram">
          <div className="diagram-title">High Water Width Cross-Sectional Area</div>
          
          <img 
            src="/assets/high-water-diagram.png" 
            alt="Stream cross-section diagram" 
            className="diagram-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
          
          <ul className="instruction-list">
            <li className="instruction-item">
              Measure the <strong>top width (W₁)</strong> at the high water mark across 3-5 representative cross-sections and average the readings.
            </li>
            <li className="instruction-item">
              Measure the <strong>bottom width (W₂)</strong> at the present water level or channel bottom.
            </li>
            <li className="instruction-item">
              Measure the <strong>average depth (D)</strong> from high water mark to the bottom of the channel.
            </li>
          </ul>
          
          <div className="field-evidence-section">
            <div className="field-evidence-title">High water evidence along uniform stream reach:</div>
            <ul className="evidence-list">
              <li className="evidence-item">Rafted debris</li>
              <li className="evidence-item">Recent scour by stream flow</li>
              <li className="evidence-item">Point below which vegetation is lacking</li>
              <li className="evidence-item">Approximates mean annual flood level (Q₂)</li>
            </ul>
          </div>
          
          <div className="instruction-formula">
            High water width cross-sectional area = ((W₁ + W₂) / 2) × D
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              checked={useBottomWidth}
              onChange={toggleBottomWidth}
            />
            {" "}Include Bottom Width (for incised streams)
          </label>
          <div className="helper-text">
            If the channel is incised or has a distinct bottom width different from the top width, enable this option.
          </div>
        </div>
        
        <div className="measurement-section">
          <div className="measurement-header">
            <h3>High Water Width (W₁) Measurements (m)</h3>
            <button className="add-button" onClick={() => addMeasurement(setTopWidthMeasurements)}>
              <span>Add Measurement</span>
            </button>
          </div>
          
          <div className="measurement-grid">
            {topWidthMeasurements.map(measurement => (
              <div className="measurement-item" key={measurement.id}>
                <div className="measurement-item-header">
                  <span className="measurement-number">#{measurement.id}</span>
                  <button 
                    className="remove-button"
                    onClick={() => removeMeasurement(measurement.id, setTopWidthMeasurements)}
                    disabled={topWidthMeasurements.length <= 1}
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="number"
                  className="measurement-input"
                  value={measurement.value}
                  onChange={(e) => handleMeasurementChange(
                    measurement.id, 
                    e.target.value, 
                    setTopWidthMeasurements
                  )}
                  placeholder="Width"
                  step="0.01"
                  min="0"
                />
              </div>
            ))}
          </div>
          
          {errors.topWidthMeasurements && (
            <div className="error-text">{errors.topWidthMeasurements}</div>
          )}
        </div>
        
        {useBottomWidth && (
          <div className="measurement-section">
            <div className="measurement-header">
              <h3>Bottom Width (W₂) Measurements (m)</h3>
              <button className="add-button" onClick={() => addMeasurement(setBottomWidthMeasurements)}>
                <span>Add Measurement</span>
              </button>
            </div>
            
            <div className="measurement-grid">
              {bottomWidthMeasurements.map(measurement => (
                <div className="measurement-item" key={measurement.id}>
                  <div className="measurement-item-header">
                    <span className="measurement-number">#{measurement.id}</span>
                    <button 
                      className="remove-button"
                      onClick={() => removeMeasurement(measurement.id, setBottomWidthMeasurements)}
                      disabled={bottomWidthMeasurements.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    type="number"
                    className="measurement-input"
                    value={measurement.value}
                    onChange={(e) => handleMeasurementChange(
                      measurement.id, 
                      e.target.value, 
                      setBottomWidthMeasurements
                    )}
                    placeholder="Width"
                    step="0.01"
                    min="0"
                  />
                </div>
              ))}
            </div>
            
            {errors.bottomWidthMeasurements && (
              <div className="error-text">{errors.bottomWidthMeasurements}</div>
            )}
          </div>
        )}
        
        <div className="measurement-section">
          <div className="measurement-header">
            <h3>Average Depth (D) Measurements (m)</h3>
            <button className="add-button" onClick={() => addMeasurement(setDepthMeasurements)}>
              <span>Add Measurement</span>
            </button>
          </div>
          
          <div className="measurement-grid">
            {depthMeasurements.map(measurement => (
              <div className="measurement-item" key={measurement.id}>
                <div className="measurement-item-header">
                  <span className="measurement-number">#{measurement.id}</span>
                  <button 
                    className="remove-button"
                    onClick={() => removeMeasurement(measurement.id, setDepthMeasurements)}
                    disabled={depthMeasurements.length <= 1}
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="number"
                  className="measurement-input"
                  value={measurement.value}
                  onChange={(e) => handleMeasurementChange(
                    measurement.id, 
                    e.target.value, 
                    setDepthMeasurements
                  )}
                  placeholder="Depth"
                  step="0.01"
                  min="0"
                />
              </div>
            ))}
          </div>
          
          {errors.depthMeasurements && <div className="error-text">{errors.depthMeasurements}</div>}
        </div>
        
        <div className="averages-container">
          <h3>Average Measurements</h3>
          <div className="averages-grid">
            <div className="average-item">
              <div className="average-label">Average Top Width (W₁)</div>
              <div className="average-value">{avgTopWidth.toFixed(2)} m</div>
            </div>
            
            {useBottomWidth && (
              <div className="average-item">
                <div className="average-label">Average Bottom Width (W₂)</div>
                <div className="average-value">{avgBottomWidth.toFixed(2)} m</div>
              </div>
            )}
            
            <div className="average-item">
              <div className="average-label">Average Depth (D)</div>
              <div className="average-value">{avgDepth.toFixed(2)} m</div>
            </div>
            
            <div className="average-item">
              <div className="average-label">Cross-sectional Area</div>
              <div className="average-value">
                {(((avgTopWidth + (useBottomWidth ? avgBottomWidth : avgTopWidth * 0.7)) / 2) * avgDepth).toFixed(2)} m²
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render progress indicator using the new style
  const renderProgressIndicator = () => {
    const stages = [
      { key: STAGES.SITE_INFO, label: 'Site Info', number: '1' },
      { key: STAGES.MEASUREMENTS, label: 'Measurements', number: '2' },
      { key: STAGES.SETTINGS, label: 'Settings', number: '3' },
      { key: STAGES.RESULTS, label: 'Results', number: '4' }
    ];
    
    return (
      <div className="progress-steps">
        {stages.map((s) => (
          <div 
            key={s.key} 
            className={`progress-step ${stage === s.key ? 'active' : ''}`}
          >
            <div className="step-number">{s.number}</div>
            <div className="step-label">{s.label}</div>
          </div>
        ))}
      </div>
    );
  };
