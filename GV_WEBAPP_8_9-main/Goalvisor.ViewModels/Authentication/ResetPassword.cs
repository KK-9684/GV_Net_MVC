﻿namespace Goalvisor.ViewModels.Authentication
{
    public class ResetPassword
    {
        public string Token { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string Messages { get; set; } = "";
    }
}