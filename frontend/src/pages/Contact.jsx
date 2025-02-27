import { Mail, MessageSquare, Send } from "lucide-react";
import PageContainer from "../components/PageContainer";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log(formData);
  };

  return (
    <div className="min-h-screen pt-16">
      <PageContainer>
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="text-base-content/80 text-lg">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 mt-12">
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="input input-bordered w-full"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      className="input input-bordered w-full"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Subject</span>
                  </label>
                  <input
                    type="text"
                    placeholder="What's this about?"
                    className="input input-bordered w-full"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Message</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-32 w-full"
                    placeholder="Your message here..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Quick Contact
                  </h2>
                  <p className="text-base-content/70">
                    Need quick help? Contact us through any of these channels:
                  </p>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <a
                        href="mailto:riyakuila539@gmail.com"
                        className="link link-hover"
                      >
                        riyakuila539@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title">Response Time</h2>
                  <p className="text-base-content/70">
                    We typically respond within 24-48 hours during business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default Contact;
