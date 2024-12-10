import React, { useState } from 'react';

interface MobileControlProps {
  onPress: () => void;
  onRelease: () => void;
  icon: string;
  type: 'dpad' | 'fire';
  direction?: 'up' | 'down' | 'left' | 'right';
}

const getDpadPosition = (direction?: string): React.CSSProperties => {
  // Base position for the D-pad container
  const dpadBase = {
    position: 'fixed',
    left: '10px',
    bottom: '10px',
    width: '150px',
    height: '150px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '75px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    pointerEvents: 'none' // Allow clicks to pass through to buttons
  } as const;

  // Base styles for the directional buttons
  const buttonBase = {
    position: 'absolute',
    width: '50px',
    height: '50px',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '25px',
    pointerEvents: 'auto' // Enable button clicks
  } as const;

  // Position each direction button within the D-pad
  switch (direction) {
    case 'up':
      return { ...buttonBase, left: '50px', top: '10px' };
    case 'left':
      return { ...buttonBase, left: '10px', top: '50px' };
    case 'right':
      return { ...buttonBase, right: '10px', top: '50px' };
    default:
      return dpadBase;
  }
};

const getFireButtonPosition = (): React.CSSProperties => ({
  position: 'fixed',
  right: '20px',
  bottom: '50px',
  width: '70px',
  height: '70px',
  backgroundColor: 'rgba(255, 0, 0, 0.3)',
  border: '3px solid rgba(255, 0, 0, 0.5)',
  borderRadius: '35px',
  pointerEvents: 'auto'
});

export const MobileControl: React.FC<MobileControlProps> = ({ 
  onPress, 
  onRelease, 
  icon, 
  type,
  direction
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPressed(true);
    onPress();
  };

  const handleRelease = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPressed(false);
    onRelease();
  };

  const baseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: type === 'fire' ? '30px' : '24px',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'none',
    userSelect: 'none',
    outline: 'none',
    padding: 0,
    zIndex: 1000,
    transform: 'translate3d(0,0,0)',
    transition: 'all 0.1s ease',
    boxShadow: isPressed 
      ? 'inset 0 0 10px rgba(255,255,255,0.5)' 
      : '0 0 10px rgba(255,255,255,0.3)',
    opacity: isPressed ? 0.8 : 1
  };

  const style = {
    ...baseStyle,
    ...(type === 'dpad' ? getDpadPosition(direction) : getFireButtonPosition())
  };

  return (
    <button
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      onTouchCancel={handleRelease}
      style={style}
    >
      {icon}
    </button>
  );
};
