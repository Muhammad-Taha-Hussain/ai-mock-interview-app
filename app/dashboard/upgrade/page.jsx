'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import plans from '@/utils/planData'

function page() {
    return (
        <div className="flex flex-col items-center py-4">
      <h1 className="text-3xl font-bold">Upgrade</h1>
      <p className="text-gray-500">
        Upgrade to monthly plan to access unlimited mock interview
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col border rounded-xl p-6 shadow-md w-72 bg-white"
          >
            <h2 className="text-lg font-bold text-center">{plan.name}</h2>
            <p className="text-center text-2xl font-bold my-2">
              {plan.cost}${' '}
              <span className="text-sm text-gray-500 font-normal">/month</span>
            </p>

            <ul className="mt-4 space-y-2">
              {plan.offering.map((offer, idx) => (
                <li
                  key={idx}
                  className={`flex items-center ${
                    offer.value.includes('✔️')
                      ? 'text-black'
                      : 'text-red-500'
                  }`}
                >
                  <span className="mr-2">{offer.value.split(' ')[0]}</span>
                  <span>{offer.value.split(' ').slice(1).join(' ')}</span>
                </li>
              ))}
            </ul>

            <Button
            variant='ghost'
              className="mt-6 px-4 py-2 border border-primary text-primary font-bold rounded-full hover:text-white hover:bg-primary transition"
              onClick={() =>
                plan.paymentLink && window.open(plan.paymentLink, '_blank')
              }
            >
              Get Started
            </Button>
          </div>
        ))}
      </div>
    </div>
    )
}

export default page
