"use client"

import { useState } from "react"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Input } from "../../elements/Input"
import { Textarea } from "../../elements/TextArea"
import { addSubmission, AddSubmissionType } from "./actions"
import { cn } from "../../utils"
import AnimatedField from "./AnimatedField"

export function ContactForm({ className }: { className?: string }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmitComment(e: React.SyntheticEvent) {
    e.preventDefault()
    setError(false)
    setSubmitting(true)

    if (!name.trim() || !email.trim() || !message.trim()) {
      setSubmitting(false)
      setError(true)
      return
    }

    const newSubmission: AddSubmissionType = {
      type: "form-submissions",
      title: name,
      metadata: { email, company, message },
    }

    try {
      const res = await addSubmission(newSubmission)
      if (!res.object) throw new Error("No response")

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setName("")
        setEmail("")
        setCompany("")
        setMessage("")
      }, 3000)
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("max-w-4xl mx-auto bg-gray-900 p-6 rounded-lg", className)}
    >
      <h2 className="mb-6 text-2xl font-bold text-white">Contactanos</h2>
      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-4 flex rounded-xl border border-red-500 p-4 bg-red-900/20 text-red-400"
          >
            <XCircle className="mr-2 h-5 w-5 shrink-0" />
            <span>
              Hubo un error. Asegurate que el valor de los campos estén correctos.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {submitted && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="flex rounded-xl border border-green-500 p-4 bg-green-900/20 text-green-400"
          >
            <CheckCircle className="mr-2 h-5 w-5 shrink-0" />
            <span>Mensaje enviado con éxito</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!submitted && (
        <motion.form
          onSubmit={handleSubmitComment}
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
        >
          <AnimatedField label="Your full name *" id="name">
            <Input
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-cyan-500"
            />
          </AnimatedField>

          <AnimatedField label="Your email *" id="email">
            <Input
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-cyan-500"
            />
          </AnimatedField>

          <AnimatedField label="Company" id="company">
            <Input
              id="company"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-cyan-500"
            />
          </AnimatedField>

          <AnimatedField label="Message *" id="message">
            <Textarea
              id="message"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-cyan-500"
            />
          </AnimatedField>


          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="pt-4"
          >
            <motion.button
              type="submit"
              disabled={submitting}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 focus:outline-none"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 16px rgba(34, 211, 238, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 inline-block animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar"
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      )}
    </motion.div>
  )
}
