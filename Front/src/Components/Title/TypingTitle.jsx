import React, { useState, useEffect } from 'react';
import './TypingTitle.css';

const TypingTitle = ({ titles }) => {
    const [typedText, setTypedText] = useState('');

    useEffect(() => {
        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeoutId;

        function typeWriter() {
            const currentTitle = titles[titleIndex];
            let newText = typedText;
            let speed = isDeleting ? 100 : 150;

            if (isDeleting) {
                // Deleting logic
                if (charIndex > 0) {
                    charIndex--;
                    newText = currentTitle.substring(0, charIndex);
                } else {
                    isDeleting = false;
                    titleIndex = (titleIndex + 1) % titles.length;
                    speed = 500; // Brief pause before typing next title
                }
            } else {
                // Typing logic
                if (charIndex < currentTitle.length) {
                    charIndex++;
                    newText = currentTitle.substring(0, charIndex);
                } else {
                    newText = currentTitle;
                    isDeleting = true;
                    speed = 2000;
                }
            }

            setTypedText(newText);
            timeoutId = setTimeout(typeWriter, speed);
        }

        // Start the effect
        typeWriter();

        // Cleanup function
        return () => clearTimeout(timeoutId);
    }, [titles]);

    return (
        <div className="typing-text-container">
            <span id="typed-text">{typedText}</span>
            <span id="typing-cursor"></span>
        </div>
    );
};

export default TypingTitle;