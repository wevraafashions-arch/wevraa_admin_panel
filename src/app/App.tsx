import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ReviewSettingsProvider } from '../contexts/ReviewSettingsContext';
import { TailorCategoriesProvider } from '../contexts/TailorCategoriesContext';
import { VendorProvider } from '../contexts/VendorContext';
import { DashboardLayout } from './components/DashboardLayout';
import { LoginPage } from './components/pages/LoginPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { OrdersPage } from './components/pages/OrdersPage';
import { ProductsPage } from './components/pages/ProductsPage';
import { InventoryPage } from './components/pages/InventoryPage';
import { CustomersPage } from './components/pages/CustomersPage';
import { CustomerReviewsPage } from './components/pages/CustomerReviewsPage';
import { CategoriesPage } from './components/pages/CategoriesPage';
import { CollectionsPage } from './components/pages/CollectionsPage';
import { VendorsPage } from './components/pages/VendorsPage';
import { TailorsPage } from './components/pages/TailorsPage';
import { TailorOrdersPage } from './components/pages/TailorOrdersPage';
import { TailorCustomersPage } from './components/pages/TailorCustomersPage';
import { TailorChatPage } from './components/pages/TailorChatPage';
import { TailorCategoriesPage } from './components/pages/TailorCategoriesPage';
import { TailorRatingsPage } from './components/pages/TailorRatingsPage';
import { TailorGalleryPage } from './components/pages/TailorGalleryPage';
import { StatusManagementPage } from './components/pages/StatusManagementPage';
import { StaffsPage } from './components/pages/StaffsPage';
import { MeasurementsPage } from './components/pages/MeasurementsPage';
import { DesignGalleryPage } from './components/pages/DesignGalleryPage';
import { AddOnsPage } from './components/pages/AddOnsPage';
import { InvoicesPage } from './components/pages/InvoicesPage';
import { UsersPage } from './components/pages/UsersPage';
import { LocationsPage } from './components/pages/LocationsPage';
import { NotificationsPage } from './components/pages/NotificationsPage';
import { AuditLogsPage } from './components/pages/AuditLogsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { TaxSettingsPage } from './components/pages/TaxSettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ReviewSettingsProvider>
            <TailorCategoriesProvider>
              <VendorProvider>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="inventory" element={<InventoryPage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="reviews" element={<CustomerReviewsPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="collections" element={<CollectionsPage />} />
                    <Route path="vendors" element={<VendorsPage />} />
                    <Route path="tailors-list" element={<TailorsPage />} />
                    <Route path="tailor-orders" element={<TailorOrdersPage />} />
                    <Route path="tailor-customers" element={<TailorCustomersPage />} />
                    <Route path="tailor-ratings" element={<TailorRatingsPage />} />
                    <Route path="tailor-chat" element={<TailorChatPage />} />
                    <Route path="tailor-categories" element={<TailorCategoriesPage />} />
                    <Route path="tailor-gallery" element={<TailorGalleryPage />} />
                    <Route path="status-management" element={<StatusManagementPage />} />
                    <Route path="staffs" element={<StaffsPage />} />
                    <Route path="measurements" element={<MeasurementsPage />} />
                    <Route path="design-gallery" element={<DesignGalleryPage />} />
                    <Route path="add-ons" element={<AddOnsPage />} />
                    <Route path="invoices" element={<InvoicesPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="locations" element={<LocationsPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="audit" element={<AuditLogsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="tax-settings" element={<TaxSettingsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </VendorProvider>
            </TailorCategoriesProvider>
          </ReviewSettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
