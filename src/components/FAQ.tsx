import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  children: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <h3>{question}</h3>
        <span className="faq-toggle">{isOpen ? '▼' : '▶'}</span>
      </div>
      <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <h2>FAQ</h2>
        
        <div className="faq-category">
          <h3>PARTICIPATION</h3>
          
          <FAQItem question="Is there a fee to enter?">
            <p>No, participation in the World's Largest Hackathon is completely free of charge.</p>
          </FAQItem>
          
          <FAQItem question="Who is eligible to enter?">
            <p>Anyone can enter the Hackathon. We welcome participants from all over the world.</p>
          </FAQItem>

        </div>
        
        <div className="faq-category">
          <h3>TIMELINE AND EVALUATION</h3>
          
          <FAQItem question="When is the submission deadline for the challenge?">
            <p>The submission deadline will be announced soon. Please check back for updates or sign up for our newsletter to be notified.</p>
          </FAQItem>
          
          <FAQItem question="What kind of project do I need to submit?">
            <p>Projects should leverage the Llama Stack in creative and innovative ways. Detailed requirements will be provided for each specific challenge.</p>
          </FAQItem>
        </div>

        <div className="faq-category">
          <h3>SUPPORT</h3>
          
          <FAQItem question="How can I get support during the hackathon?">
            <p>We will have a dedicated support team available to help you with any questions or issues you may have. You can also join our Discord community to get help from other participants.</p>
          </FAQItem>
          
          <FAQItem question="What Ai models or tools can I use?">
            <p>You can use any Ai models or tools you want. Everything is fair game.</p>
          </FAQItem>
        </div>

      </div>
    </section>
  );
};

export default FAQ; 