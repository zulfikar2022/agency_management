import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useRef, useState } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
  const passwordInput = useRef();
  const currentPasswordInput = useRef();

  const { data, setData, errors, put, reset, processing, recentlySuccessful } =
    useForm({
      current_password: '',
      password: '',
      password_confirmation: '',
    });

  const [seePassword, setSeePassword] = useState(false);

  const updatePassword = (e) => {
    e.preventDefault();

    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset('password', 'password_confirmation');
          passwordInput.current.focus();
        }

        if (errors.current_password) {
          reset('current_password');
          currentPasswordInput.current.focus();
        }
      },
    });
  };

  return (
    // <section className={className}>
    <section className="w-full md:w-1/2 mx-auto bg-white p-6 rounded-md shadow-md mt-5 mb-5">
      <div className="mb-4 mt-4">
        <Link href={route('home')} className="text-blue-700 underline ">
          {' '}
          <span className="flex">
            <ArrowLeft /> <span>ফিরে যান</span>
          </span>{' '}
        </Link>
      </div>{' '}
      <header>
        <h2 className="text-lg font-medium text-gray-900">
          পাসওয়ার্ড আপডেট করুন
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          সবসময় শক্তিশালী পাসওয়ার্ড ব্যবহার করুন যাতে আপনার অ্যাকাউন্ট সুরক্ষিত
          থাকে।
        </p>
      </header>
      <form onSubmit={updatePassword} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="current_password" value="বর্তমান পাসওয়ার্ড" />

          <TextInput
            id="current_password"
            ref={currentPasswordInput}
            value={data.current_password}
            onChange={(e) => setData('current_password', e.target.value)}
            type={seePassword ? 'text' : 'password'}
            className="mt-1 block w-full"
            autoComplete="current-password"
          />

          <InputError message={errors.current_password} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="password" value="নতুন পাসওয়ার্ড" />

          <TextInput
            id="password"
            ref={passwordInput}
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            type={seePassword ? 'text' : 'password'}
            className="mt-1 block w-full"
            autoComplete="new-password"
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div>
          <InputLabel
            htmlFor="password_confirmation"
            value="পাসওয়ার্ড নিশ্চিত করুন"
          />

          <TextInput
            id="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            type={seePassword ? 'text' : 'password'}
            className="mt-1 block w-full"
            autoComplete="new-password"
          />

          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={seePassword}
              onChange={() => setSeePassword(!seePassword)}
            />
            <span className="ml-2">
              {!seePassword ? 'পাসওয়ার্ড দেখুন' : 'পাসওয়ার্ড লুকান'}
            </span>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing}>আপডেট করুন</PrimaryButton>

          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-gray-600">সংরক্ষিত হয়েছে।</p>
          </Transition>
        </div>
        {/* write a checkbox to toggle password visibility */}
      </form>
    </section>
  );
}
