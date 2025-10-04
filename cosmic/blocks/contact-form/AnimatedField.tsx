"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Label } from "../../elements/Label"
interface AnimatedFieldProps {
  label: string
  id: string
  children: React.ReactNode
}

export default function AnimatedField({ label, id, children }: AnimatedFieldProps) {
  const [focused, setFocused] = useState(false)

  return (
    <motion.div
      className="relative"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <Label htmlFor={id}>{label}</Label>
      <motion.div
        className="rounded-lg"
        animate={
          focused
            ? { boxShadow: "0 0 0 3px rgba(99,102,241,0.6)" }
            : { boxShadow: "0 0 0 0px rgba(0,0,0,0)" }
        }
        transition={{ duration: 0.3 }}
      >
        {React.cloneElement(children as React.ReactElement, {
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
        })}
      </motion.div>
    </motion.div>
  )
}
