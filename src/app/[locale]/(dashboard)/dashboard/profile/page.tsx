import React from 'react'
import { getCurrentSession } from '@/actions/auth'
import { redirect } from 'next/navigation'

import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChangePasswordForm } from '../components/change-password-form'


type Props = {}

const ProfilePage = async (props: Props) => {
  const session = await getCurrentSession()
  
  // Rediriger si l'utilisateur n'est pas connecté
  if (!session?.user) {
    redirect('/login')
  }

  const user = session.user
  const firstLetter = user.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div className='p-6  mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='font-bold text-2xl'>Mon Compte</h1>
      </div>
      
      {/* Section Profil */}
      <div className='flex flex-col md:flex-row gap-6 mb-8'>
        <div className='flex-1 flex items-center gap-4 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm'>
          <div className='flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 text-white text-xl font-bold'>
            {firstLetter}
          </div>
          
          <div className='flex-1'>
            <h2 className='text-lg font-semibold'>
              {user.email}
            </h2>
            
            {user.subscriptionLevel && (
              <div className='mt-2'>
                <span className={`
                  px-3 py-1 text-xs rounded-full font-medium
                  ${user.subscriptionLevel === 'premium' ? 'bg-purple-100 text-purple-800' : 
                    user.subscriptionLevel === 'pro' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'}
                `}>
                  {user.subscriptionLevel.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className='bg-white border border-gray-100 rounded-3xl shadow-sm p-6 w-full md:w-64'>
          <h3 className='font-medium  mb-2'>Votre compte</h3>
          <p className='text-sm text-gray-500'>Membre depuis le {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Section Changement de mot de passe */}
      <div className='bg-white border border-gray-100 rounded-3xl shadow-sm p-6 mb-8'>
        <h2 className='font-bold text-xl mb-4'>Sécurité du compte</h2>
        <div className='max-w-lg'>
          <ChangePasswordForm  userId={user.id} />
        </div>
      </div>

      
    </div>
  )
}

export default ProfilePage