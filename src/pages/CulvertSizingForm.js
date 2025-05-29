  // Render measurements section
  const renderMeasurementsSection = () => (
    <div className="form-section">
      <div className="section-header">
        <span className="nav-icon">📏</span>
        <div>
          <h3>Stream Measurements</h3>
          <p>Enter field measurements for bankfull stream dimensions. Multiple measurements will be averaged.</p>
        </div>
      </div>

      {/* Top Width Measurements */}
      <div className="factor-group">
        <h4>Top Width Measurements (Required)</h4>
        <p className="helper-text">
          Measure the stream width at bankfull stage (high water mark) in meters.
        </p>
        
        {topWidthMeasurements.map((measurement, index) => (
          <div key={index} className="measurement-input-row">
            <input
              type="number"
              value={measurement}
              onChange={(e) => handleMeasurementChange(index, e.target.value, topWidthMeasurements, setTopWidthMeasurements)}
              placeholder="e.g., 2.5"
              step="0.1"
              min="0"
            />
            <span className="unit-label">meters</span>
            {topWidthMeasurements.length > 1 && (
              <button
                type="button"
                onClick={() => removeMeasurement(index, topWidthMeasurements, setTopWidthMeasurements)}
                className="remove-measurement-btn"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => addMeasurement(topWidthMeasurements, setTopWidthMeasurements)}
          className="add-measurement-btn"
        >
          + Add Top Width Measurement
        </button>
        
        {errors.topWidthMeasurements && <div className="status-message error">{errors.topWidthMeasurements}</div>}
      </div>

      {/* Bottom Width Toggle and Measurements */}
      <div className="factor-group">
        <div className="feature-toggle">
          <input
            type="checkbox"
            id="useBottomWidth"
            checked={useBottomWidth}
            onChange={toggleBottomWidth}
          />
          <label htmlFor="useBottomWidth">
            Include Bottom Width Measurements (For Incised/Trapezoidal Channels)
          </label>
        </div>

        {useBottomWidth && (
          <>
            <h4>Bottom Width Measurements</h4>
            <p className="helper-text">
              Measure the stream bottom width (wetted width) in meters for incised channels.
            </p>
            
            {bottomWidthMeasurements.map((measurement, index) => (
              <div key={index} className="measurement-input-row">
                <input
                  type="number"
                  value={measurement}
                  onChange={(e) => handleMeasurementChange(index, e.target.value, bottomWidthMeasurements, setBottomWidthMeasurements)}
                  placeholder="e.g., 1.8"
                  step="0.1"
                  min="0"
                />
                <span className="unit-label">meters</span>
                {bottomWidthMeasurements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMeasurement(index, bottomWidthMeasurements, setBottomWidthMeasurements)}
                    className="remove-measurement-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addMeasurement(bottomWidthMeasurements, setBottomWidthMeasurements)}
              className="add-measurement-btn"
            >
              + Add Bottom Width Measurement
            </button>
            
            {errors.bottomWidthMeasurements && <div className="status-message error">{errors.bottomWidthMeasurements}</div>}
          </>
        )}
      </div>

      {/* Depth Measurements */}
      <div className="factor-group">
        <h4>Depth Measurements (Required)</h4>
        <p className="helper-text">
          Measure the bankfull depth (vertical distance from water surface to stream bottom) in meters.
        </p>
        
        {depthMeasurements.map((measurement, index) => (
          <div key={index} className="measurement-input-row">
            <input
              type="number"
              value={measurement}
              onChange={(e) => handleMeasurementChange(index, e.target.value, depthMeasurements, setDepthMeasurements)}
              placeholder="e.g., 0.8"
              step="0.1"
              min="0"
            />
            <span className="unit-label">meters</span>
            {depthMeasurements.length > 1 && (
              <button
                type="button"
                onClick={() => removeMeasurement(index, depthMeasurements, setDepthMeasurements)}
                className="remove-measurement-btn"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => addMeasurement(depthMeasurements, setDepthMeasurements)}
          className="add-measurement-btn"
        >
          + Add Depth Measurement
        </button>
        
        {errors.depthMeasurements && <div className="status-message error">{errors.depthMeasurements}</div>}
      </div>