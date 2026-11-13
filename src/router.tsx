import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from '@/components'
import { BookDetail } from '@/screens/BookDetail'
import { Books } from '@/screens/Books'
import { NotFound } from '@/screens/NotFound'

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route
        element={
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        }
      >
        <Route index element={<Books />} />
        <Route path="books/:id" element={<BookDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
