
import { useState, useEffect, useCallback } from 'react';

interface TagData {
  id: string;
  name: string;
  value: number | boolean;
  timestamp: Date;
  quality: 'Good' | 'Bad' | 'Uncertain';
  unit?: string;
}

interface UseRealTimeDataReturn {
  tags: Record<string, TagData>;
  isConnected: boolean;
  addTag: (tag: Omit<TagData, 'timestamp'>) => void;
  updateTag: (id: string, value: number | boolean) => void;
  subscribeToTag: (tagId: string, callback: (data: TagData) => void) => () => void;
}

export const useRealTimeData = (): UseRealTimeDataReturn => {
  const [tags, setTags] = useState<Record<string, TagData>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [subscribers, setSubscribers] = useState<Record<string, Array<(data: TagData) => void>>>({});

  // Simulate data updates
  useEffect(() => {
    setIsConnected(true);
    
    // Initialize some sample tags
    const initialTags: Record<string, TagData> = {
      'motor_speed': {
        id: 'motor_speed',
        name: 'Motor Speed',
        value: 1750,
        timestamp: new Date(),
        quality: 'Good',
        unit: 'RPM'
      },
      'temperature': {
        id: 'temperature',
        name: 'Temperature',
        value: 42.5,
        timestamp: new Date(),
        quality: 'Good',
        unit: '°C'
      },
      'pressure': {
        id: 'pressure',
        name: 'Pressure',
        value: 15.2,
        timestamp: new Date(),
        quality: 'Good',
        unit: 'Bar'
      },
      'tank_level': {
        id: 'tank_level',
        name: 'Tank Level',
        value: 75.3,
        timestamp: new Date(),
        quality: 'Good',
        unit: '%'
      }
    };
    
    setTags(initialTags);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setTags(prevTags => {
        const updatedTags = { ...prevTags };
        
        Object.keys(updatedTags).forEach(tagId => {
          const tag = updatedTags[tagId];
          let newValue = tag.value;
          
          // Simulate realistic value changes
          if (typeof newValue === 'number') {
            const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
            newValue = Math.max(0, newValue * (1 + variation));
            
            // Add some specific behaviors
            if (tagId === 'motor_speed') {
              newValue = Math.min(2000, Math.max(0, newValue));
            } else if (tagId === 'temperature') {
              newValue = Math.min(100, Math.max(0, newValue));
            } else if (tagId === 'tank_level') {
              newValue = Math.min(100, Math.max(0, newValue));
            }
          }
          
          const updatedTag = {
            ...tag,
            value: newValue,
            timestamp: new Date()
          };
          
          updatedTags[tagId] = updatedTag;
          
          // Notify subscribers
          if (subscribers[tagId]) {
            subscribers[tagId].forEach(callback => callback(updatedTag));
          }
        });
        
        return updatedTags;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [subscribers]);

  const addTag = useCallback((tagData: Omit<TagData, 'timestamp'>) => {
    const newTag: TagData = {
      ...tagData,
      timestamp: new Date()
    };
    
    setTags(prev => ({
      ...prev,
      [newTag.id]: newTag
    }));
  }, []);

  const updateTag = useCallback((id: string, value: number | boolean) => {
    setTags(prev => {
      if (!prev[id]) return prev;
      
      const updatedTag = {
        ...prev[id],
        value,
        timestamp: new Date()
      };
      
      // Notify subscribers
      if (subscribers[id]) {
        subscribers[id].forEach(callback => callback(updatedTag));
      }
      
      return {
        ...prev,
        [id]: updatedTag
      };
    });
  }, [subscribers]);

  const subscribeToTag = useCallback((tagId: string, callback: (data: TagData) => void) => {
    setSubscribers(prev => ({
      ...prev,
      [tagId]: [...(prev[tagId] || []), callback]
    }));

    // Return unsubscribe function
    return () => {
      setSubscribers(prev => ({
        ...prev,
        [tagId]: (prev[tagId] || []).filter(cb => cb !== callback)
      }));
    };
  }, []);

  return {
    tags,
    isConnected,
    addTag,
    updateTag,
    subscribeToTag
  };
};
