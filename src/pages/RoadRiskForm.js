              width: '5px',
              height: '20px',
              background: 'linear-gradient(to bottom, #673ab7, #9575cd)',
              borderRadius: '2px'
            }}></span>
            Drainage Structure
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px' }}>
            <ScoreButton 
              factor="drainageStructure" 
              value={2} 
              currentValue={consequenceFactors.drainageStructure} 
              onChange={handleConsequenceChange} 
              label="Adequate for 100+ year events" 
            />
            <ScoreButton 
              factor="drainageStructure" 
              value={4} 
              currentValue={consequenceFactors.drainageStructure} 
              onChange={handleConsequenceChange} 
              label="Adequate for 50-year events" 
            />
            <ScoreButton 
              factor="drainageStructure" 
              value={6} 
              currentValue={consequenceFactors.drainageStructure} 
              onChange={handleConsequenceChange} 
              label="Adequate for 25-year events" 
            />
            <ScoreButton 
              factor="drainageStructure" 
              value={10} 
              currentValue={consequenceFactors.drainageStructure} 
              onChange={handleConsequenceChange} 
              label="Undersized or deteriorating" 
            />
          </div>
        </div>
        
        {/* Public/Industrial Use with Enhanced Styling */}
        <div style={{ 
          marginBottom: '40px',
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: 'rgba(103, 58, 183, 0.03)',
          border: '1px solid rgba(103, 58, 183, 0.1)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <h3 style={{ 
            marginBottom: '18px', 
            color: '#333',
            fontSize: '1.2rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            paddingLeft: '15px'
          }}>
            <span style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '5px',
              height: '20px',
              background: 'linear-gradient(to bottom, #673ab7, #9575cd)',
              borderRadius: '2px'
            }}></span>
            Public/Industrial Use
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px' }}>
            <ScoreButton 
              factor="publicIndustrialUse" 
              value={2} 
              currentValue={consequenceFactors.publicIndustrialUse} 
              onChange={handleConsequenceChange} 
              label="Minimal use (wilderness road)" 
            />
            <ScoreButton 
              factor="publicIndustrialUse" 
              value={4} 
              currentValue={consequenceFactors.publicIndustrialUse} 
              onChange={handleConsequenceChange} 
              label="Low volume industrial use" 
            />
            <ScoreButton 
              factor="publicIndustrialUse" 
              value={6} 
              currentValue={consequenceFactors.publicIndustrialUse} 
              onChange={handleConsequenceChange} 
              label="Moderate public/industrial" 
            />
            <ScoreButton 
              factor="publicIndustrialUse" 
              value={10} 
              currentValue={consequenceFactors.publicIndustrialUse} 
              onChange={handleConsequenceChange} 
              label="High volume/mainline road" 
            />
          </div>
        </div>
        
        {/* Environmental Value with Enhanced Styling */}
        <div style={{ 
          marginBottom: '30px',
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: 'rgba(103, 58, 183, 0.03)',
          border: '1px solid rgba(103, 58, 183, 0.1)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <h3 style={{ 
            marginBottom: '18px', 
            color: '#333',
            fontSize: '1.2rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            paddingLeft: '15px'
          }}>
            <span style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '5px',
              height: '20px',
              background: 'linear-gradient(to bottom, #673ab7, #9575cd)',
              borderRadius: '2px'
            }}></span>
            Environmental Value
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px' }}>
            <ScoreButton 
              factor="environmentalValue" 
              value={2} 
              currentValue={consequenceFactors.environmentalValue} 
              onChange={handleConsequenceChange} 
              label="No significant values" 
            />
            <ScoreButton 
              factor="environmentalValue" 
              value={4} 
              currentValue={consequenceFactors.environmentalValue} 
              onChange={handleConsequenceChange} 
              label="Standard riparian/wildlife" 
            />
            <ScoreButton 
              factor="environmentalValue" 
              value={6} 
              currentValue={consequenceFactors.environmentalValue} 
              onChange={handleConsequenceChange} 
              label="Important habitat or cultural" 
            />
            <ScoreButton 
              factor="environmentalValue" 
              value={10} 
              currentValue={consequenceFactors.environmentalValue} 
              onChange={handleConsequenceChange} 
              label="Critical habitat/cultural site" 
            />
          </div>
        </div>
        
        <div style={{ 
          background: 'linear-gradient(to right, rgba(103, 58, 183, 0.05), rgba(103, 58, 183, 0.1))', 
          padding: '20px 24px', 
          borderRadius: '12px',
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid rgba(103, 58, 183, 0.15)'
        }}>
          <span style={{ 
            fontWeight: '600', 
            fontSize: '1.1rem',
            color: '#333'
          }}>Total Consequence Score:</span>
          <span style={{ 
            fontWeight: '700', 
            fontSize: '1.4rem',
            padding: '10px 22px',
            background: 'linear-gradient(to bottom, #fff, #f9f9f9)',
            borderRadius: '10px',
            color: '#673ab7',
            boxShadow: '0 3px 8px rgba(103, 58, 183, 0.15)',
            border: '1px solid rgba(103, 58, 183, 0.2)'
          }}>{consequenceScore}</span>
        </div>
      </div>
      
      {/* Enhanced Risk Result Section with Better Styling, Gradients and Animations */}
      <div style={{ 
        background: `${riskColors[riskColorKey]}`, 
        padding: '35px', 
        borderRadius: '16px', 
        marginBottom: '28px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${riskTextColors[riskColorKey]}30`,
        transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: `linear-gradient(135deg, ${riskTextColors[riskColorKey]}CC, ${riskTextColors[riskColorKey]})`,
          color: 'white',
          padding: '10px 24px',
          borderBottomLeftRadius: '16px',
          fontWeight: '700',
          fontSize: '1.1rem',
          boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '22px',
            height: '22px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>!</span>
          {riskCategory} Risk
        </div>
        
        {/* Abstract background pattern for visual interest */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 20%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.15) 0%, transparent 25%)',
          pointerEvents: 'none'
        }}></div>
        
        <h2 style={{ 
          borderBottom: `1px solid ${riskTextColors[riskColorKey]}40`, 
          paddingBottom: '15px', 
          marginBottom: '25px',
          color: riskTextColors[riskColorKey],
          fontSize: '1.8rem',
          fontWeight: '700'
        }}>
          <span style={{ 
            display: 'inline-block', 
            width: '5px', 
            height: '24px', 
            backgroundColor: riskTextColors[riskColorKey], 
            marginRight: '12px', 
            verticalAlign: 'middle',
            borderRadius: '3px'
          }}></span>
          Risk Assessment Results
        </h2>
        
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '15px', 
            alignItems: 'center' 
          }}>
            <span style={{ fontWeight: '600', fontSize: '1.1rem', color: '#333' }}>Hazard Score:</span>
            <span style={{ 
              fontWeight: '600',
              fontSize: '1.1rem',
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '10px',
              color: '#ff9800',
              boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>{hazardScore}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '15px', 
            alignItems: 'center' 
          }}>
            <span style={{ fontWeight: '600', fontSize: '1.1rem', color: '#333' }}>Consequence Score:</span>
            <span style={{ 
              fontWeight: '600',
              fontSize: '1.1rem',
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '10px',
              color: '#673ab7',
              boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>{consequenceScore}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '5px', 
            alignItems: 'center',
            marginTop: '30px',
            backgroundColor: 'rgba(255,255,255,0.5)',
            padding: '18px 24px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255,255,255,0.4)'
          }}>
            <span style={{ 
              fontWeight: '700', 
              fontSize: '1.4rem', 
              color: '#333'
            }}>Risk Score:</span>
            <span style={{ 
              fontWeight: '700',
              fontSize: '1.8rem',
              padding: '12px 25px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              color: riskTextColors[riskColorKey],
              boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
              border: `1px solid ${riskTextColors[riskColorKey]}30`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {riskScore}
              <span style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: `linear-gradient(to right, transparent, ${riskTextColors[riskColorKey]}70, transparent)`,
                opacity: 0.7
              }}></span>
            </span>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '30px',
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.4)',
          position: 'relative'
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            color: riskTextColors[riskColorKey], 
            fontWeight: '600', 
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              backgroundColor: riskTextColors[riskColorKey],
              color: 'white',
              borderRadius: '50%',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              boxShadow: `0 3px 8px ${riskTextColors[riskColorKey]}50`
            }}>!</span>
            Professional Resource Requirements
          </h3>
          <p style={{ 
            margin: 0, 
            color: '#333', 
            lineHeight: '1.7',
            fontSize: '1.05rem',
            paddingLeft: '40px'
          }}>
            {riskCategory === 'Very High' && 'Full professional team with CRP and specialist PORs. Geometric design required. Multiple field reviews.'}
            {riskCategory === 'High' && 'CRP and road activity POR (may be same person for simple roads). Specialist consultation. Field reviews at critical stages.'}
            {riskCategory === 'Moderate' && 'CRP and road activity POR oversight. Standard designs with field verification.'}
            {riskCategory === 'Low' && 'Standard oversight by qualified professionals. Routine field reviews.'}
            {riskCategory === 'Very Low' && 'Routine professional oversight.'}
          </p>
          {/* Recommended actions section */}
          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: `1px solid ${riskTextColors[riskColorKey]}30`
          }}>
            <h4 style={{
              color: riskTextColors[riskColorKey],
              fontWeight: '600',
              marginBottom: '12px',
              fontSize: '1.1rem'
            }}>Recommended Actions:</h4>
            <ul style={{
              paddingLeft: '60px',
              margin: '0',
              color: '#444',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              {riskCategory === 'Very High' && (
                <>
                  <li>Immediate closure or traffic restriction recommended</li>
                  <li>Develop comprehensive remediation plan</li>
                  <li>Schedule regular monitoring (minimum monthly)</li>
                  <li>Install warning signage</li>
                </>
              )}
              {riskCategory === 'High' && (
                <>
                  <li>Traffic restrictions during wet weather</li>
                  <li>Develop remediation plan within 30 days</li>
                  <li>Schedule monitoring after significant rain events</li>
                  <li>Install cautionary signage</li>
                </>
              )}
              {riskCategory === 'Moderate' && (
                <>
                  <li>Quarterly monitoring recommended</li>
                  <li>Maintenance plans should address identified risks</li>
                  <li>Consider improved drainage works</li>
                </>
              )}
              {riskCategory === 'Low' && (
                <>
                  <li>Annual inspection recommended</li>
                  <li>Include in routine maintenance scheduling</li>
                </>
              )}
              {riskCategory === 'Very Low' && (
                <>
                  <li>Include in regular road inspection cycles</li>
                  <li>No immediate action required</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Enhanced Photo Documentation Section with Better Styling */}
      <div style={{
        ...sectionStyle,
        backgroundImage: 'linear-gradient(to bottom, #ffffff, #fafafa)',
        borderTop: '4px solid #00bcd4'
      }}>
        <h2 style={{
          ...sectionHeaderStyle,
          color: '#00bcd4'
        }}>
          <span style={{ 
            display: 'inline-block', 
            width: '5px', 
            height: '24px', 
            background: 'linear-gradient(to bottom, #00bcd4, #4dd0e1)', 
            marginRight: '12px', 
            verticalAlign: 'middle',
            borderRadius: '3px'
          }}></span>
          Photo Documentation
        </h2>
        
        <button
          type="button"
          onClick={handleAddPhoto}
          style={{
            padding: '14px 22px',
            background: 'linear-gradient(to bottom, #26c6da, #00bcd4)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '25px',
            boxShadow: '0 4px 10px rgba(0, 188, 212, 0.25)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 15px rgba(0, 188, 212, 0.35)'
            },
            '&:active': {
              transform: 'translateY(1px)',
              boxShadow: '0 2px 5px rgba(0, 188, 212, 0.2)'
            }
          }}
        >
          <span style={{
            width: '26px',
            height: '26px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem'
          }}>
            +
          </span>
          Add Photo
        </button>
        
        {photos.length > 0 ? (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '20px', 
            marginTop: '20px'
          }}>
            {photos.map(photo => (
              <div 
                key={photo.id} 
                style={{ 
                  position: 'relative', 
                  width: '200px', 
                  marginBottom: '20px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.12)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  transform: 'translateY(0)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.18)'
                  },
                  backgroundColor: '#fff'
                }}
              >
                <div style={{
                  position: 'relative',
                  overflow: 'hidden',
                  height: '200px'
                }}>
                  <img
                    src={photo.url}
                    alt={photo.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'all 0.5s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(231, 76, 60, 0.85)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                      transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      '&:hover': {
                        backgroundColor: 'rgba(231, 76, 60, 1)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#fff',
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <div style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    {photo.name}
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#777',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: '1px solid #aaa',
                      display: 'inline-flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '0.7rem',
                      color: '#777'
                    }}>
                      🕒
                    </span>
                    {new Date(photo.timestamp).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '40px 20px',
            backgroundColor: '#f9f9fa',
            borderRadius: '12px',
            border: '2px dashed #ddd',
            textAlign: 'center',
            color: '#777',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '15px',
              color: '#00bcd4'
            }}>📷</div>
            <p style={{ 
              margin: '0',
              fontSize: '1.1rem',
              fontWeight: '500'
            }}>No photos added yet</p>
            <p style={{
              margin: '10px 0 0 0',
              fontSize: '0.95rem',
              color: '#999'
            }}>
              Click the button above to add photos documenting road conditions
            </p>
          </div>
        )}
      </div>
      
      {/* Enhanced Comments Section with Better Styling */}
      <div style={{
        ...sectionStyle,
        backgroundImage: 'linear-gradient(to bottom, #ffffff, #fafafa)',
        borderTop: '4px solid #ff5722'
      }}>
        <h2 style={{
          ...sectionHeaderStyle,
          color: '#ff5722'
        }}>
          <span style={{ 
            display: 'inline-block', 
            width: '5px', 
            height: '24px', 
            background: 'linear-gradient(to bottom, #ff5722, #ff7043)', 
            marginRight: '12px', 
            verticalAlign: 'middle',
            borderRadius: '3px'
          }}></span>
          Comments & Observations
        </h2>
        
        <textarea
          name="comments"
          value={comments}
          onChange={handleCommentsChange}
          placeholder="Enter any additional observations, notes, or specific concerns about the road section..."
          style={{
            width: '100%',
            minHeight: '150px',
            padding: '18px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            resize: 'vertical',
            fontSize: '1rem',
            lineHeight: '1.6',
            outline: 'none',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            backgroundColor: '#fafafa',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
            '&:focus': {
              borderColor: '#ff5722',
              boxShadow: '0 0 0 3px rgba(255, 87, 34, 0.1)',
              backgroundColor: '#fff'
            }
          }}
        />
        
        {/* Comment instruction */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          fontSize: '0.9rem',
          color: '#666',
          padding: '10px 15px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 87, 34, 0.05)',
          border: '1px solid rgba(255, 87, 34, 0.1)'
        }}>
          <span style={{
            color: '#ff5722',
            fontSize: '1.2rem',
            lineHeight: '1'
          }}>💡</span>
          <span>Include details about observed drainage patterns, erosion signs, vegetation conditions, or any other factors that may affect road stability.</span>
        </div>
      </div>
      
      {/* Enhanced Action Buttons with Better Styling and Animations */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px',
        position: 'sticky',
        bottom: '20px',
        zIndex: 10,
        padding: '20px',
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255, 255, 255, 0.7)'
      }}>
        <button
          type="button"
          onClick={handleSaveAssessment}
          style={{
            flex: 1,
            padding: '16px',
            background: 'linear-gradient(45deg, #43a047, #66bb6a)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1.1rem',
            boxShadow: '0 4px 10px rgba(76, 175, 80, 0.25)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              boxShadow: '0 6px 14px rgba(76, 175, 80, 0.35)',
              transform: 'translateY(-2px)'
            },
            '&:active': {
              transform: 'translateY(1px)',
              boxShadow: '0 2px 5px rgba(76, 175, 80, 0.2)'
            }
          }}
        >
          <span style={{
            width: '24px',
            height: '24px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem'
          }}>
            ✓
          </span>
          Save Assessment
          <span style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shine 2s infinite',
            pointerEvents: 'none'
          }}></span>
        </button>
        
        <button
          type="button"
          onClick={handleSaveDraft}
          style={{
            flex: 1,
            padding: '16px',
            background: 'linear-gradient(45deg, #f5f5f5, #ffffff)',
            color: '#1976d2',
            border: '1px solid #1976d2',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1.1rem',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 5px rgba(25, 118, 210, 0.1)',
            '&:hover': {
              backgroundColor: '#f0f7ff',
              boxShadow: '0 4px 8px rgba(25, 118, 210, 0.15)',
              transform: 'translateY(-2px)'
            },
            '&:active': {
              transform: 'translateY(1px)',
              boxShadow: 'none'
            }
          }}
        >
          <span style={{
            width: '24px',
            height: '24px',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            color: '#1976d2'
          }}>
            💾
          </span>
          Save Draft
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <button
          type="button"
          onClick={handleExportPDF}
          style={{
            flex: 1,
            padding: '16px',
            background: 'linear-gradient(45deg, #f5f5f5, #eeeeee)',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '1rem',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            '&:hover': {
              backgroundColor: '#e9e9e9',
              boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <span style={{
            fontSize: '1.2rem'
          }}>
            📄
          </span>
          Export PDF
        </button>
        
        <button
          type="button"
          onClick={handleNewAssessment}
          style={{
            flex: 1,
            padding: '16px',
            background: 'linear-gradient(45deg, #eceff1, #cfd8dc)',
            color: '#455a64',
            border: '1px solid #b0bec5',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '1rem',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            '&:hover': {
              backgroundColor: '#cfd8dc',
              boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <span style={{
            fontSize: '1.2rem'
          }}>
            🔄
          </span>
          New Assessment
        </button>
      </div>
      
      {/* Add global animation styles */}
      <style>
        {`
          @keyframes shine {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          /* Add responsive styles for mobile */
          @media (max-width: 768px) {
            .score-buttons {
              flex-direction: column;
              gap: 10px;
            }
            
            .coordinate-inputs {
              flex-direction: column;
            }
            
            .action-buttons {
              flex-direction: column;
            }
          }
        `}
      </style>
    </div>
  );
}

export default RoadRiskForm;