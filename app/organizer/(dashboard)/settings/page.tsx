'use client'

import * as React from "react"
import {User, Lock, Camera} from 'lucide-react'
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Header} from "@/components/ui/header";

interface SettingsInputProps {
    defaultValue?: string
    placeholder?: string
    type?: string
}

const SettingsInput = ({defaultValue, placeholder, type = "text"}: SettingsInputProps) => (
    <Input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-14 rounded-2xl border-2 border-[#5C5C5C] bg-white px-6 font-display text-lg text-[#0E0E0E] focus-visible:ring-0 placeholder:text-[#5C5C5C]/50"
    />
)

export default function SettingsPage() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-white">
            <Header name={"Angela Mae Cabrera"} email={"angelamaecabrera@gmail.com"}/>
            <div className="flex min-h-screen w-full flex-col bg-[#F9F7FD] px-10 py-6 space-y-8">
                <div>
                    <h1 className="text-5xl font-black text-[#261A36] tracking-tight uppercase">Settings</h1>
                    <p className="text-[#574272] font-bold mt-1">Configure your account and system preferences.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                    <Card
                        className="rounded-[40px] border-2 border-[#5C5C5C] bg-white p-8 shadow-[8px_8px_0px_0px_rgba(87,66,114,1)]">
                        <CardHeader className="flex flex-row items-center gap-4 p-0 mb-8">
                            <div className="rounded-full border-2 border-[#5C5C5C] p-2">
                                <User size={32} className="text-[#261A36]"/>
                            </div>
                            <CardTitle
                                className="text-3xl font-black text-[#261A36] uppercase tracking-tight">Profile</CardTitle>
                        </CardHeader>

                        <CardContent className="p-0 flex flex-col items-center gap-8">
                            <div className="relative group cursor-pointer">
                                <div
                                    className="h-56 w-56 rounded-full border-[6px] border-[#261A36] bg-[#7B55A3] flex items-end justify-center overflow-hidden">
                                    <div
                                        className="w-24 h-24 bg-white rounded-full mb-[-10px] border-4 border-[#261A36]"/>
                                    <div
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-4 border-[#261A36] mb-8"/>
                                </div>
                                <div
                                    className="absolute bottom-4 right-4 bg-black p-2 rounded-lg border-2 border-white text-white shadow-lg">
                                    <Camera size={20}/>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="w-full space-y-4">
                                <SettingsInput defaultValue="Angela Mae Cabrera"/>
                                <SettingsInput defaultValue="gathr.w@gmail.com"/>
                                <SettingsInput defaultValue="Event Organizer"/>
                                <SettingsInput defaultValue="a.cabrera67"/>
                            </div>

                            <Button
                                className="w-full h-16 rounded-2xl bg-[#FF8C66] text-xl font-black text-white uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:bg-[#ff7a4d] transition-all active:translate-y-1 active:shadow-none">
                                Update Profile
                            </Button>
                        </CardContent>
                    </Card>

                    {/* SECURITY CARD */}
                    <Card
                        className="rounded-[40px] border-2 border-[#5C5C5C] bg-white p-8 shadow-[8px_8px_0px_0px_rgba(87,66,114,1)]">
                        <CardHeader className="flex flex-row items-center gap-4 p-0 mb-8">
                            <div className="rounded-full border-2 border-[#5C5C5C] p-2">
                                <Lock size={32} className="text-[#261A36]"/>
                            </div>
                            <CardTitle
                                className="text-3xl font-black text-[#261A36] uppercase tracking-tight">Security</CardTitle>
                        </CardHeader>

                        <CardContent className="p-0 space-y-8">
                            <div className="space-y-4">
                                <SettingsInput type="password" placeholder="••••••••••••••••••••••••••••••••"/>
                            </div>

                            <Button
                                className="w-full h-16 rounded-2xl bg-[#FF8C66] text-xl font-black text-white uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:bg-[#ff7a4d] transition-all active:translate-y-1 active:shadow-none">
                                Reset Password
                            </Button>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
