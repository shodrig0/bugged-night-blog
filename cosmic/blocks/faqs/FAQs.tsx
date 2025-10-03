// components/faqs.tsx
import { useEffect, useState } from "react"
import { cosmic } from "../../client"

type FAQ = {
  question: string
  answer: string
}

type FAQsProps = {
  query: any
  className?: string
  status?: "draft" | "published" | "any"
}

// Async function to fetch and render FAQs
export async function FAQs({
  query,
  className,
  status,
}: FAQsProps): Promise<JSX.Element> {
  const { object: page } = await cosmic.objects
    .findOne(query)
    .props("id,title,metadata.faqs")
    .depth(1)
    .status(status ? status : "published")

  const faqs: FAQ[] = page?.metadata?.faqs || []

  return (
    <section className={className}>
      <h2 className="text-2xl font-bold mb-4">{page?.title ?? "FAQs"}</h2>
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

// Wrapper component for React Router
export function FAQsWrapper(props: FAQsProps) {
  const [content, setContent] = useState<JSX.Element | null>(null)

  useEffect(() => {
    FAQs(props).then(setContent)
  }, [props.query, props.className, props.status])

  return content
}
