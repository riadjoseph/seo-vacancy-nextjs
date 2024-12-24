import { useEffect } from 'react';

interface ScriptProps extends React.HTMLProps<HTMLScriptElement> {
  onLoad?: () => void;
}

const Script = ({ onLoad, ...props }: ScriptProps) => {
  useEffect(() => {
    const script = document.createElement('script');

    // Handle all properties as attributes to avoid read-only property issues
    Object.entries(props).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        script.setAttribute(key, String(value));
      }
    });

    if (onLoad) {
      script.onload = onLoad;
    }

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default Script;