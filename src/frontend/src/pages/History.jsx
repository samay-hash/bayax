import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLightbulb, faChalkboardTeacher, faArrowRight, faSpinner,
  faFolderOpen, faCalendarAlt, faTag, faFlask, faClock
} from '@fortawesome/free-solid-svg-icons'
import { fetchIdeas, fetchIdeaById, fetchLessons, fetchLessonById } from '../apiFrontend/historyApi'

const TabButton = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
      ${active
        ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
      }`}
  >
    <FontAwesomeIcon icon={icon} />
    {label}
  </button>
)

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── IDEA CARD ────────────────────────────────────────────────────────────────

const IdeaCard = ({ project, onClick, index }) => (
  <motion.button
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    onClick={onClick}
    className="w-full text-left bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 hover:border-cyan-400 dark:hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-200 group"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate text-lg group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
          {project.projectName}
        </h3>
        <div className="flex flex-wrap items-center gap-3 mt-2.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 px-2.5 py-1 rounded-lg">
            <FontAwesomeIcon icon={faTag} className="text-[10px]" />
            {project.field}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-[10px]" />
            {formatDate(project.createdAt)}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            project.status === 'completed'
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
          }`}>
            {project.status}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
        <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
      </div>
    </div>
  </motion.button>
)

// ─── LESSON CARD ──────────────────────────────────────────────────────────────

const LessonCard = ({ plan, onClick, index }) => (
  <motion.button
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    onClick={onClick}
    className="w-full text-left bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 hover:border-cyan-400 dark:hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-200 group"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate text-lg group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
          {plan.topic}
        </h3>
        <div className="flex flex-wrap items-center gap-3 mt-2.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 px-2.5 py-1 rounded-lg">
            <FontAwesomeIcon icon={faFlask} className="text-[10px]" />
            {plan.subject}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <FontAwesomeIcon icon={faTag} className="text-[10px]" />
            Grade {plan.grade}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <FontAwesomeIcon icon={faClock} className="text-[10px]" />
            {plan.duration} min
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-[10px]" />
            {formatDate(plan.createdAt)}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
        <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
      </div>
    </div>
  </motion.button>
)

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

const EmptyState = ({ type }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
      <FontAwesomeIcon icon={faFolderOpen} className="text-3xl text-slate-400 dark:text-slate-500" />
    </div>
    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
      No {type === 'idea' ? 'Blueprints' : 'Lesson Plans'} Yet
    </h3>
    <p className="text-slate-500 dark:text-slate-400 max-w-sm">
      {type === 'idea'
        ? "Generate your first startup blueprint from the Dashboard to see it here."
        : "Create your first lesson plan from the Dashboard to see it here."
      }
    </p>
  </motion.div>
)

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-lg mb-3" />
            <div className="flex gap-3">
              <div className="h-6 w-16 bg-slate-100 dark:bg-slate-700/60 rounded-lg" />
              <div className="h-6 w-24 bg-slate-100 dark:bg-slate-700/60 rounded-lg" />
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700" />
        </div>
      </div>
    ))}
  </div>
)

// ─── MAIN HISTORY PAGE ────────────────────────────────────────────────────────

const History = () => {
  const [activeTab, setActiveTab] = useState('idea')
  const [ideas, setIdeas] = useState([])
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [ideaRes, lessonRes] = await Promise.all([fetchIdeas(), fetchLessons()])
    if (ideaRes.success) setIdeas(ideaRes.projects)
    if (lessonRes.success) setLessons(lessonRes.lessonPlans)
    setLoading(false)
  }

  const handleIdeaClick = async (id) => {
    const res = await fetchIdeaById(id)
    if (res.success && res.project) {
      navigate('/idea-result', { state: { result: res.project.analysisData } })
    }
  }

  const handleLessonClick = async (id) => {
    const res = await fetchLessonById(id)
    if (res.success && res.plan) {
      navigate('/lesson-result', {
        state: {
          lessonPlan: res.plan.lessonData,
          subject: res.plan.subject,
          topic: res.plan.topic,
          grade: res.plan.grade,
          duration: res.plan.duration,
        }
      })
    }
  }

  return (
    <div className="flex flex-col items-center mt-24 min-h-[calc(100vh-6rem)] sm:px-0 px-4 max-w-4xl mx-auto w-full pb-20">

      {/* Header */}
      <div className="text-center mb-8 w-full">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Your History
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Browse and revisit your past AI-generated blueprints and lesson plans.
        </p>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        <TabButton
          active={activeTab === 'idea'}
          icon={faLightbulb}
          label={`Blueprints${ideas.length ? ` (${ideas.length})` : ''}`}
          onClick={() => setActiveTab('idea')}
        />
        <TabButton
          active={activeTab === 'lesson'}
          icon={faChalkboardTeacher}
          label={`Lesson Plans${lessons.length ? ` (${lessons.length})` : ''}`}
          onClick={() => setActiveTab('lesson')}
        />
      </div>

      {/* Content */}
      <div className="w-full">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'idea' ? (
              <motion.div
                key="ideas"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {ideas.length === 0 ? (
                  <EmptyState type="idea" />
                ) : (
                  ideas.map((project, i) => (
                    <IdeaCard
                      key={project._id}
                      project={project}
                      index={i}
                      onClick={() => handleIdeaClick(project._id)}
                    />
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div
                key="lessons"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {lessons.length === 0 ? (
                  <EmptyState type="lesson" />
                ) : (
                  lessons.map((plan, i) => (
                    <LessonCard
                      key={plan._id}
                      plan={plan}
                      index={i}
                      onClick={() => handleLessonClick(plan._id)}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default History
