// components/faqs.tsx
import { useEffect, useState } from "react"
import { getFAQs } from '../../../src/lib/cosmic'
import { FAQ as FAQType } from '../../../src/types'

export function FAQsWrapper() {
  const [faqs, setFaqs] = useState<FAQType[]>([])

  useEffect(() => {
    getFAQs().then(setFaqs)
  }, [])

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Preguntas Frecuentes</h2>
      <div className="space-y-4">
        {faqs.length === 0 ? (
          <p className="text-gray-400">No FAQs available.</p>
        ) : (
          faqs.map((faq, idx) => (
            <div key={idx} className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold text-cyan-400 mb-2">{faq.question}</h3>
              <p className="text-gray-300">{faq.answer}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
