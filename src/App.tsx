import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Characters from './pages/Characters'
import Rankings from './pages/Rankings'
import PatchNotes from './pages/PatchNotes'
import Maps from './pages/Maps'
import Tournaments from './pages/Tournaments'
import { ContactForm } from '../cosmic/blocks/contact-form/ContactForm'
import { FAQsWrapper } from '../cosmic/blocks/faqs/FAQs'
import Footer from './components/Footer'


export default function App() {
    return (
        <Router>
            <div className="min-h-screen gradient-bg">
                <Navigation />
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/characters" element={<Characters />} />
                        <Route path="/rankings" element={<Rankings />} />
                        <Route path="/patch-notes" element={<PatchNotes />} />
                        <Route path="/maps" element={<Maps />} />
                        <Route path="/tournaments" element={<Tournaments />} />
                        <Route path="/contactform" element={<ContactForm />} />
                        <Route path="/faqs" element={<FAQsWrapper />} />
                    </Routes>
                </main>
            </div>
            <Footer />
        </Router>
    )
}