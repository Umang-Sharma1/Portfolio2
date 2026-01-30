'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_CONTACT_MESSAGE } from '@/lib/graphql/mutations';
import { Button, Input } from '@portfolio/ui';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const [submitMessage, { loading }] = useMutation(SEND_CONTACT_MESSAGE, {
    onCompleted: () => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitMessage({ variables: { input: formData } });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container py-24">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have a question or want to work together? I'd love to hear from you.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for reaching out. I'll get back to you as soon as possible.
              </p>
              <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </div>

              <div>
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </div>

              <div>
                <Input
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <Button type="submit" size="lg" fullWidth disabled={loading}>
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="mt-12 pt-12 border-t text-center">
            <p className="text-muted-foreground mb-4">Or reach out directly:</p>
            <a
              href="mailto:your.email@example.com"
              className="inline-flex items-center text-primary hover:underline"
            >
              <Mail className="mr-2 h-4 w-4" />
              your.email@example.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
